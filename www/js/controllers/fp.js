angular.module('uhiApp.controllers').controller('FpController', function($scope, $timeout, WomanService, familyPlanning, videos) {
  var id = 'A-102.1';
  $scope.woman = WomanService.getWomanDetails(id);

  // add mock scope variables to be received from service
  $scope.woman.ageYoungestChild = 1;
  $scope.woman.genderYoungestChild = 'm';
  $scope.woman.isPregnant = false;
  $scope.woman.isBreastFeeding = false;

  var familyPlanningMethods = familyPlanning.getFamilyPlanningMethods();

  $scope.selectFPMethod = function(methodID) {
     var filteredMethodList = familyPlanningMethods.filter(function(e) {
      return e.id === methodID;
    });
    $scope.FPMethod = filteredMethodList[0];

    $scope.question = {};
    $scope.question.list = familyPlanning.getQuestions();
    $scope.messages = familyPlanning.getMessages();
    console.log($scope.FPMethod);
  };

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

});
