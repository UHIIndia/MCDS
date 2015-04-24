angular.module('uhiApp.controllers').controller('FpController', function($scope, $timeout, WomanService, familyPlanning, videos, UtilityService) {

  var womanDisplayID = UtilityService.getWomanDisplayID();
  $scope.woman = WomanService.getWomanDetails(womanDisplayID);

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

    $scope.response = 'unanswered';
    $scope.showMessage = false;

    if(methodID === 0 || methodID === 1 || methodID === 2) {
      $scope.responseType = 'bool';
    } else {
      $scope.responseType = 'datetime';
    }
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

    if($scope.FPMethod.id === 3) {
      $scope.response = true;
      if($scope.response) {
        $scope.showMessage = true;
      }
    }

    if($scope.FPMethod.id === 4) {
      $scope.response = true;
      if($scope.response) {
        $scope.showMessage = true;
      }
    }

    if($scope.FPMethod.id === 5) {
      $scope.showMessage = false;
    }

    if($scope.FPMethod.id === 6) {
      $scope.response = true;
      if($scope.response) {
        $scope.showMessage = true;
      }
    }

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
