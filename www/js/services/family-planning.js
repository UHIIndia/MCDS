angular.module('uhiApp.services').factory('familyPlanning',function(){

  var familyPlanningMethods = [
    {
      'id': 0,
      'name': 'None'
    },
    {
      'id': 1,
      'name': 'Condom'
    },
    {
      'id': 2,
      'name': 'OCP'
    },
    {
      'id': 3,
      'name': 'DMPA'
    },
    {
      'id': 4,
      'name': 'IUCD'
    },
    {
      'id': 5,
      'name': 'Female Sterilisation'
    },
    {
      'id': 6,
      'name': 'Male Sterilisation'
    }
  ];

  var getFamilyPlanningMethods = function() {
    return familyPlanningMethods;
  };

  return {
    getFamilyPlanningMethods: getFamilyPlanningMethods
  }
});
