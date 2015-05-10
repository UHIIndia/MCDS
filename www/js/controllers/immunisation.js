angular.module('uhiApp.controllers').controller('ImmunisationController', function($scope, $timeout, UtilityService, ChildService, videos) {

  var displayID = UtilityService.getChildDisplayID();
  $scope.child = ChildService.getChildDetails(displayID);

  $scope.childDisplay = angular.copy($scope.child);
  $scope.childDisplay.age = calculateChildAge($scope.childDisplay.dob);

  $scope.monthLabels = [
    {
      'id': 1,
      'name': 'Oct'
    },
    {
      'id': 2,
      'name': 'Nov'
    },
    {
      'id': 3,
      'name': 'Dec'
    },
    {
      'id': 4,
      'name': 'Jan'
    },{
      'id': 5,
      'name': 'Feb'
    },
    {
      'id': 6,
      'name': 'Mar'
    },
    {
      'id': 7,
      'name': 'Apr'
    },{
      'id': 8,
      'name': 'May'
    },
    {
      'id': 9,
      'name': 'Jun'
    },{
      'id': 10,
      'name': 'Jul'
    },
    {
      'id': 11,
      'name': 'Aug'
    },
    {
      'id': 12,
      'name': 'Sep'
    },
    {
      'id': 13,
      'name': 'Oct'
    },
    {
      'id': 14,
      'name': 'Nov'
    },
    {
      'id': 15,
      'name': 'Dec'
    },
    {
      'id': 16,
      'name': 'Jan'
    },{
      'id': 17,
      'name': 'Feb'
    },
    {
      'id': 18,
      'name': 'Mar'
    },
    {
      'id': 19,
      'name': 'Apr'
    },{
      'id': 20,
      'name': 'May'
    },
    {
      'id': 21,
      'name': 'Jun'
    },{
      'id': 22,
      'name': 'Jul'
    },
    {
      'id': 23,
      'name': 'Aug'
    },
    {
      'id': 24,
      'name': 'Sep'
    },
    {
      'id': 25,
      'name': 'Oct'
    },
    {
      'id': 26,
      'name': 'Nov'
    },
    {
      'id': 27,
      'name': 'Dec'
    },
    {
      'id': 28,
      'name': 'Jan'
    },{
      'id': 29,
      'name': 'Feb'
    },
    {
      'id': 30,
      'name': 'Mar'
    },
    {
      'id': 31,
      'name': 'Apr'
    },{
      'id': 32,
      'name': 'May'
    },
    {
      'id': 33,
      'name': 'Jun'
    },{
      'id': 34,
      'name': 'Jul'
    },
    {
      'id': 35,
      'name': 'Aug'
    },
    {
      'id': 36,
      'name': 'Sep'
    }
  ];

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
