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
