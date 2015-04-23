angular.module('uhiApp.controllers')
.controller('newBornController',  function($scope, UtilityService, ChildService){ 
  
  //get child Details
  function init(){
    var displayID = UtilityService.getChildVisibleID();
    if(!displayID){
      console.log('should not be here, child is not added in system');
    } else {
      // fetch child details 
      $scope.child = ChildService.getChildDetails(displayID);
    }
  }
  init();
});