angular.module('starter.controllers').controller('FpController', function($scope, WomanService, familyPlanning) {
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
    console.log($scope.FPMethod);
  };

});
