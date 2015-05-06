angular.module('uhiApp.controllers').controller('navController', function($scope, $state, UtilityService) {
  $scope.settingsOpen = false;
  $scope.addWoman = function(){
    console.info('nav controllers');
    UtilityService.setWomanDisplayID(null).then(function(success){
      $state.go('add');
    });    
  }
});
