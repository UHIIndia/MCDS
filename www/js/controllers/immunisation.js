angular.module('uhiApp.controllers').controller('ImmunisationController', function($scope, UtilityService, ChildService) {

  var displayID = UtilityService.getChildDisplayID();
  $scope.child = ChildService.getChildDetails(displayID);

  $scope.childDisplay = angular.copy($scope.child);
  $scope.childDisplay.age = calculateChildAge($scope.childDisplay.dob);

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
