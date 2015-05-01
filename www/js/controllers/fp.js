angular.module('uhiApp.controllers').controller('FpController', function($scope, $timeout, WomanService, ChildService, familyPlanning, videos, UtilityService) {

  var womanDisplayID = UtilityService.getWomanDisplayID();
  $scope.woman = WomanService.getWomanDetails(womanDisplayID);

  var children = ChildService.getChildren($scope.woman.womanID);
  var youngestChild;

  if(children.length === 1) {
    youngestChild = children[0];
  } else if(children.length > 0) {
    var sortedChildren = _.sortBy(children, function(child) {
      var dobString = child.dob;
      var dobElementsArray = dobString.split('/');
      var d, m, y;
      d = dobElementsArray[0];
      m = dobElementsArray[1];
      y = dobElementsArray[2];
      return new Date(m + '/' + d + '/' + y);
    });
    youngestChild = _.last(sortedChildren);
  }
  $scope.child = youngestChild;

  if($scope.child) {
    $scope.child.age = calculateAge($scope.child.dob);
  }

  $scope.womanDisplay = {};
  var imageURI = UtilityService.loadImage($scope.woman.womanID);
  if(imageURI) {
    $scope.womanDisplay.image = imageURI;
  } else {
    $scope.womanDisplay.image = 'img/woman-sample-profile-picture.png';
  }


  var familyPlanningMethods = familyPlanning.getFamilyPlanningMethods();

  $scope.selectFPMethod = function(methodID) {
     var filteredMethodList = familyPlanningMethods.filter(function(e) {
      return e.id === methodID;
    });
    $scope.FPMethod = filteredMethodList[0];

    $scope.question = {};
    $scope.question.list = familyPlanning.getQuestions();
    $scope.messages = familyPlanning.getMessages();

    $scope.response = 'unanswered';
    $scope.showMessage = false;

    if(methodID === 0 || methodID === 1 || methodID === 2) {
      $scope.responseType = 'bool';
    } else {
      $scope.responseType = 'datetime';
    }

    $scope.methodUseDate = null;
  };

  $scope.response = 'unanswered';
  $scope.showMessage = false;

  $scope.respond = function(response) {
    $scope.response = response;
    $scope.showMessage = false;

    if($scope.FPMethod.id === 0) {
      if($scope.response === 'yes') {
        $scope.showMessage = false;
      } else if($scope.response === 'no') {
        $scope.showMessage = true;
      }
    }

    if($scope.FPMethod.id === 1) {
      if($scope.response === 'yes' || $scope.response === 'no') {
        $scope.showMessage = true;
      }
    }

    if($scope.FPMethod.id === 2) {
      if($scope.response === 'yes' || $scope.response === 'no') {
        $scope.showMessage = true;
      }
    }
  };

  $scope.responseDate = new Date();
  $scope.methodUseDate = new Date();
  $scope.futureImportantDate = null;

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = !$scope.opened;
  };

  $scope.$watch('methodUseDate', function enableMessage(n) {
    if(n) {
      $scope.showMessage = true;
      if($scope.FPMethod && $scope.FPMethod.id === 3) {
        $scope.futureImportantDate = calculateNextDate(3);
      } else if($scope.FPMethod && $scope.FPMethod.id === 4) {
        $scope.futureImportantDate = calculateNextDate(4);
      } else if($scope.FPMethod && $scope.FPMethod.id === 6) {
        $scope.futureImportantDate = calculateNextDate(6);
      }
    }
  });

  $scope.video = {};

  $scope.video.list = videos.getFamilyPlanningVideos();

  $scope.video.play = function(id) {
    var selectedVideo = $scope.video.list.filter(function(e) {
      return e.id === id;
    });
    $scope.video.path = selectedVideo[0].path;
    $scope.video.show = true;
    $timeout(function() {
      document.getElementById('selected-video').play();
    }, 1000);
  };

  $scope.video.stop = function() {
    document.getElementById('selected-video').pause();
    $scope.video.show = false;
  };

  $scope.save = function() {
    if($scope.FPMethod) {
      var methodRecord = {};
      var date = new Date();
      methodRecord.displayID = $scope.woman.displayID + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear());
      methodRecord.methodID = $scope.FPMethod.id;
      methodRecord.methodName = $scope.FPMethod.name;
      methodRecord.didUseMethodRecently = null;
      if($scope.FPMethod.id < 3) {
        methodRecord.didUseMethodRecently = $scope.response;
        methodRecord.methodUseDate = new Date().toISOString();
      } else {
        methodRecord.methodUseDate = $scope.methodUseDate.toISOString();
      }
      methodRecord.visitDate = new Date().toISOString();
      updateOrCreateMethodRecord(methodRecord);
      WomanService.updateWomanDetails($scope.woman);
    }
  };

  $scope.methodCalendar = {};
  $scope.methodCalendar.thisYear = new Date().getFullYear();
  var oldestYearTimestamp = _.chain($scope.woman.familyPlanningVisits)
    .pluck('visitDate')
    .sortBy(function(e) {
      return new Date(e);
    })
    .first()
    .value();
  $scope.methodCalendar.oldestYear = new Date(oldestYearTimestamp).getFullYear();
  $scope.methodCalendar.countYearsData = 1 + $scope.methodCalendar.thisYear - $scope.methodCalendar.oldestYear;
  $scope.methodCalendar.data = [];
  var methodArray = [];
  for(var year = $scope.methodCalendar.oldestYear; year <= $scope.methodCalendar.thisYear; year++) {
    var thisYearMethods = _.chain($scope.woman.familyPlanningVisits)
      .filter(function(e) {
        return year === new Date(e.methodUseDate).getFullYear();
      })
      .map(function(e) {
        var monthID = new Date(e.methodUseDate).getMonth() + 1;
        e.monthID = monthID;
        return e;
      })
      .indexBy('monthID')
      .value();
    var thisYearObj = {
      'year': year,
      'methods': thisYearMethods
    };
    methodArray.push(thisYearObj);
  }
  $scope.methodCalendar.data = _.sortBy(methodArray, function (e) {
    return -e.year
  });

  $scope.methodCalendar.currentMonth = new Date().getMonth() + 1;

  $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function calculateNextDate(requesterMethodID) {
    var now, nextImpTimestamp;
    now = $scope.methodUseDate;
    if(requesterMethodID === 3) {
      nextImpTimestamp = (now.getTime() + (1000*60*60*24*90));
    } else if(requesterMethodID === 4) {
      nextImpTimestamp = (now.getTime() + (1000*60*60*24*365*3));
    } else if(requesterMethodID === 6) {
      nextImpTimestamp = (now.getTime() + (1000*60*60*24*90));
    }
    return new Date(nextImpTimestamp);
  }

  function updateOrCreateMethodRecord(thisMethodRecord) {
    if(thisMethodRecord.methodID < 3) {
      $scope.woman.familyPlanningVisits = _.reject($scope.woman.familyPlanningVisits, function(e) {
        return new Date(e.methodUseDate).getMonth() === new Date().getMonth();
      });
      $scope.woman.familyPlanningVisits.push(thisMethodRecord);
    } else if(thisMethodRecord.methodID === 3) {
      var methodMonthIndex = new Date(thisMethodRecord.methodUseDate).getMonth();
      var thisMonthIndex = new Date().getMonth();
      var monthsCount = thisMonthIndex - methodMonthIndex;
      for(var count=0; count<=monthsCount; count++) {
        thisMethodRecord.methodUseDate = new Date('2015-' + (methodMonthIndex+1+count) + '-15').toISOString();
        $scope.woman.familyPlanningVisits.push(thisMethodRecord);
      }
    } else if(thisMethodRecord.methodID === 4) {
      var methodMonthIndex = new Date(thisMethodRecord.methodUseDate).getMonth();
      var thisMonthIndex = new Date().getMonth();
      var monthsCount = thisMonthIndex - methodMonthIndex;
      for(var count=0; count<=monthsCount; count++) {
        thisMethodRecord.methodUseDate = new Date('2015-' + (methodMonthIndex+1+count) + '-15').toISOString();
        $scope.woman.familyPlanningVisits.push(thisMethodRecord);
      }
    } else if(thisMethodRecord.methodID === 5) {
        $scope.woman.familyPlanningVisits.push(thisMethodRecord);
    } else if(thisMethodRecord.methodID === 6) {
        $scope.woman.familyPlanningVisits.push(thisMethodRecord);
    }
  }

  function calculateAge(pastDate) {
    var age = {};
    var rawAge = new Date().getTime() - new Date(pastDate).getTime();
    var ageInMonths = Math.floor(rawAge / (1000*60*60*24*31));
    age.years = Math.floor(ageInMonths/12);
    age.months = ageInMonths % 12;
    return age;
  }

});
