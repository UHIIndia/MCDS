angular.module('uhiApp.controllers').controller('navController', function($scope, UtilityService) {
  $scope.settingsOpen = false;
  $scope.addWoman = function(){
    UtilityService.setWomanDisplayID(null);    
  }
});
