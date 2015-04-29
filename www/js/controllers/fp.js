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
    var visit = {};
    var date = new Date();
    if($scope.FPMethod) {
      visit.displayID = $scope.woman.displayID + '-' + (date.getMonth() + 1) + '-' + (date.getFullYear());
      visit.methodID = $scope.FPMethod.id;
      visit.methodName = $scope.FPMethod.name;
      visit.didUseMethodRecently = null;
      if($scope.FPMethod.id < 3) {
        visit.didUseMethodRecently = $scope.response;
      }
      visit.methodUseDate = $scope.methodUseDate;
      visit.visitDateString = new Date().toString();
      updateOrCreateVisit(visit);
    }
    WomanService.updateWomanDetails($scope.woman)
  };

  $scope.visitCalendar = {};
  $scope.visitCalendar.thisYear = new Date().getFullYear();
  var oldestYearTimestamp = _.chain($scope.woman.familyPlanningVisits)
    .pluck('visitDateString')
    .sortBy(function(e) {
      return new Date(e);
    })
    .first()
    .value();
  $scope.visitCalendar.oldestYear = new Date(oldestYearTimestamp).getFullYear();
  $scope.visitCalendar.countYearsData = 1 + $scope.visitCalendar.thisYear - $scope.visitCalendar.oldestYear;
  $scope.visitCalendar.data = [];
  var visitsArray = [];
  for(var year = $scope.visitCalendar.oldestYear; year <= $scope.visitCalendar.thisYear; year++) {
    var thisYearVisits = _.chain($scope.woman.familyPlanningVisits)
      .filter(function(e) {
        return year === new Date(e.visitDateString).getFullYear();
      })
      .map(function(e) {
        var monthID = new Date(e.visitDateString).getMonth() + 1;
        e.monthID = monthID;
        return e;
      })
      .indexBy('monthID')
      .value();
    var thisYearObj = {
      'year': year,
      'visits': thisYearVisits
    };
    visitsArray.push(thisYearObj);
  }
  $scope.visitCalendar.data = _.sortBy(visitsArray, function (e) {
    return -e.year
  });

  $scope.visitCalendar.currentMonth = new Date().getMonth() + 1;

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

  function updateOrCreateVisit(thisVisit) {
    var sortedVisits = _.sortBy($scope.woman.familyPlanningVisits, function(e) {
      return new Date(e.visitDateString);
    });
    var lastVisit = _.last(sortedVisits);
    var lastVisitMonthIndex = new Date(lastVisit.visitDateString).getMonth();
    var thisMonthIndex = new Date().getMonth();
    if(lastVisitMonthIndex === thisMonthIndex) {
      $scope.woman.familyPlanningVisits.splice($scope.woman.familyPlanningVisits.length-1, 1);
    }
    $scope.woman.familyPlanningVisits.push(thisVisit);
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
