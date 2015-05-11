angular.module('uhiApp.controllers').controller('ImmunisationController', function($scope, $timeout, UtilityService, ChildService, videos) {

  var displayID = UtilityService.getChildDisplayID();
  $scope.child = ChildService.getChildDetails(displayID);

  $scope.childDisplay = angular.copy($scope.child);

  $scope.childDisplay.age = calculateChildAge($scope.childDisplay.dob);
  var monthNameArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var rawMonthLabels = new Array(36);
  $scope.monthLabels = _.chain(rawMonthLabels)
    .map(function(e, index) {
      var e = {};
      e.id = index + 1;
      var monthIndex = (new Date($scope.childDisplay.dob).getMonth() + index) % 12;
      e.name = monthNameArray[monthIndex];
      return e;
    })
    .value();

  $scope.monthInformationData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

  $scope.video = {};

  $scope.video.list = videos.getImmunisationVideos();

  $scope.video.play = function(id) {
    var selectedVideo = $scope.video.list.filter(function(e) {
      return e.id === id;
    });
    $scope.video.path = selectedVideo[0].path;
    $scope.video.show = true;
    $timeout(function() {
      document.getElementById('selected-video').play();
    }, 0);
  };

  $scope.video.stop = function() {
    document.getElementById('selected-video').pause();
    $scope.video.show = false;
  };

  $scope.vaccinationSelectedDate = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null
  };

  $scope.isWeak = null;

  $scope.isOpenForVaccination = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false
  };

  $scope.openCalendar = function(vaccinationId, $event) {
    $event.preventDefault();
    $event.stopPropagation();

    _.each($scope.isOpenForVaccination, function(value) {
      value = false;
    });

    $scope.isOpenForVaccination[vaccinationId] = true;
  };

  if(typeof($scope.child.immunisationDetails) === 'undefined') {
    $scope.child.immunisationDetails = [];

    for(var i=0; i<=35; i++) {
      var immunisationDetailsForThisMonth ={};
      immunisationDetailsForThisMonth.monthId = i+1;
      $scope.child.immunisationDetails.push(immunisationDetailsForThisMonth);
    }
  }

  $scope.visibleMonthIndexForVaccine = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null
  };

  var dobTimeOfChild = new Date($scope.childDisplay.dob).getTime();
  var selectedTime, timeDiffInMs, timeInMonths;

  $scope.$watch('vaccinationSelectedDate[1]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[1]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[1] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[2]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[2]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[2] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[3]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[3]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[3] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[4]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[4]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[4] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[5]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[5]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[5] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[6]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[6]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[6] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[7]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[7]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[7] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  $scope.$watch('vaccinationSelectedDate[8]', function(n) {
    if(n) {
      selectedTime = new Date($scope.vaccinationSelectedDate[8]).getTime();
      timeDiffInMs = selectedTime - dobTimeOfChild;
      $scope.visibleMonthIndexForVaccine[8] = Math.floor(timeDiffInMs / (1000*60*60*24*30));
    }
  });

  function calculateChildAge(pastDate) {
    var date = new Date(pastDate);
    var ageInExactDays = (new Date().getTime() - date.getTime()) / (1000*60*60*24);
    var ageInDays = Math.floor(ageInExactDays);
    var months = Math.floor(ageInDays/30);
    var days = Math.floor(ageInDays%30);
    var age = {};
    age.months = months;
    age.days = days;
    return age;
  }

});
