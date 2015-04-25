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

});
