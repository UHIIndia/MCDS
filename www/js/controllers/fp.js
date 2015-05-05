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
  $scope.womanDisplay.age = calculateWomanAge($scope.woman.dob);

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
      updateMethodCalendar();
    }
  };

  $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $scope.today = new Date();

  function updateMethodCalendar() {
    $scope.methodCalendar = {};
    $scope.methodCalendar.thisYear = new Date().getFullYear();
    var oldestYearTimestamp = _.chain($scope.woman.familyPlanningVisits)
      .pluck('methodUseDate')
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
          var year = new Date(e.methodUseDate).getFullYear();
          e.monthID = monthID;
          e.year = year;
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
    if(methodArray.length === 0) {
      for(var year = $scope.methodCalendar.thisYear-1; year <= $scope.methodCalendar.thisYear; year++) {
        var thisYearMethods = _.chain($scope.months)
          .map(function(e) {
            var monthID = e + 1;
            e.monthID = monthID;
            e.year = year;
            return e;
          })
          .indexBy('monthID')
          .value();
        var thisYearObj = {
          'year': year
        };
        methodArray.push(thisYearObj);
      }
    }
    $scope.methodCalendar.data = _.sortBy(methodArray, function (e) {
      return -e.year
    });
  }

  updateMethodCalendar();

  $scope.methodCalendar.currentMonth = new Date().getMonth() + 1;

  $scope.isVisible = function(yearData, month, methodID) {
    var flag;
    if(methodID === 0) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 0) || ($scope.FPMethod && $scope.FPMethod.id === 0 && $scope.methodCalendar.currentMonth === month && $scope.methodCalendar.thisYear === yearData.year && $scope.response !== 'unanswered');
    } else if(methodID === 1) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 1) || ($scope.FPMethod && $scope.FPMethod.id === 1 && $scope.methodCalendar.currentMonth === month && $scope.methodCalendar.thisYear === yearData.year && $scope.response !== 'unanswered');
    } else if(methodID === 2) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 2) || ($scope.FPMethod && $scope.FPMethod.id === 2 && $scope.methodCalendar.currentMonth === month && $scope.methodCalendar.thisYear === yearData.year && $scope.response !== 'unanswered');
    } else if(methodID === 3) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 3) || ($scope.FPMethod && $scope.FPMethod.id === 3 && $scope.methodUseDate && $scope.methodUseDate.getMonth()+1 === month && $scope.methodUseDate.getFullYear() === yearData.year);
    } else if(methodID === 4) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 4) || ($scope.FPMethod && $scope.FPMethod.id === 4 && $scope.methodUseDate && $scope.methodUseDate.getMonth()+1 === month && $scope.methodUseDate.getFullYear() === yearData.year);
    } else if(methodID === 5) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 5) || ($scope.FPMethod && $scope.FPMethod.id === 5 && $scope.methodUseDate && $scope.methodUseDate.getMonth()+1 === month && $scope.methodUseDate.getFullYear() === yearData.year);
    } else if(methodID === 6) {
      flag = (yearData.methods[month] && yearData.methods[month].methodID === 6) || ($scope.FPMethod && $scope.FPMethod.id === 6  && $scope.methodUseDate && $scope.methodUseDate.getMonth()+1 === month && $scope.methodUseDate.getFullYear() === yearData.year);
    }
    return flag;
  };

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
    if(thisMethodRecord.methodID <= 2) {
      var thisMethodRecordCopy = angular.copy(thisMethodRecord);
      $scope.woman.familyPlanningVisits = _.reject($scope.woman.familyPlanningVisits, function(e) {
        return new Date(e.methodUseDate).getMonth() === new Date(thisMethodRecordCopy.methodUseDate).getMonth() && new Date(e.methodUseDate).getFullYear() === new Date(thisMethodRecordCopy.methodUseDate).getFullYear();
      });
      $scope.woman.familyPlanningVisits.push(thisMethodRecord);
    } else if(thisMethodRecord.methodID === 3) {
      for(var count=0; count<=3; count++) {
        var thisMethodRecordCopy = angular.copy(thisMethodRecord);
        thisMethodRecordCopy.methodUseDate = getNextMonthTimestamp(thisMethodRecordCopy.methodUseDate, count);
        thisMethodRecordCopy.highlight = null;
        if(count === 3) {
          thisMethodRecordCopy.highlight = true;
        }
        $scope.woman.familyPlanningVisits = _.reject($scope.woman.familyPlanningVisits, function(e) {
          return new Date(e.methodUseDate).getMonth() === new Date(thisMethodRecordCopy.methodUseDate).getMonth() && new Date(e.methodUseDate).getFullYear() === new Date(thisMethodRecordCopy.methodUseDate).getFullYear();
        });
        $scope.woman.familyPlanningVisits.push(thisMethodRecordCopy);
      }
    } else if(thisMethodRecord.methodID === 4) {
      var methodMonthIndex = new Date(thisMethodRecord.methodUseDate).getMonth();
      var thisMonthIndex = new Date().getMonth();
      var monthsCount = thisMonthIndex - methodMonthIndex;
      for(var count=0; count<=monthsCount; count++) {
        var thisMethodRecordCopy = angular.copy(thisMethodRecord);
        thisMethodRecordCopy.methodUseDate = getNextMonthTimestamp(thisMethodRecordCopy.methodUseDate, count);
        thisMethodRecordCopy.highlight = null;
        if(count === monthsCount) {
          thisMethodRecordCopy.highlight = true;
        }
        $scope.woman.familyPlanningVisits = _.reject($scope.woman.familyPlanningVisits, function(e) {
          return new Date(e.methodUseDate).getMonth() === new Date(thisMethodRecordCopy.methodUseDate).getMonth() && new Date(e.methodUseDate).getFullYear() === new Date(thisMethodRecordCopy.methodUseDate).getFullYear();
        });
        $scope.woman.familyPlanningVisits.push(thisMethodRecordCopy);
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

  function calculateWomanAge(pastDate) {
    var dobArray = pastDate.split('/');
    var date = new Date(dobArray[2] + '-' + dobArray[1] + '-' + dobArray[0]);
    var age = (new Date().getTime() - date.getTime()) / (1000*60*60*24*365);
    return Math.floor(age);
  }

  function getNextMonthTimestamp(timestamp, offsetMonthCount) {
    var date = new Date(timestamp);
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateNum = date.getDate();
    var rawNextMonth = monthIndex + offsetMonthCount;
    var yearsToAdd = Math.floor(rawNextMonth/12);
    var monthsIndex = Math.floor(rawNextMonth%12);
    var nextYearMonth = {};
    nextYearMonth.month = monthsIndex + 1;
    nextYearMonth.year = year + yearsToAdd;
    nextYearMonth.date = dateNum;
    var nextMonthTimestamp = new Date(nextYearMonth.year + '-' + nextYearMonth.month + '-' + nextYearMonth.date);
    var nextMonthTimestampString = nextMonthTimestamp.toISOString();
    return nextMonthTimestampString;
  }

});
