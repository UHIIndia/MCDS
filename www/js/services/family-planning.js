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

  var getQuestions = function() {
    return [
      'Do you want to get pregnant?',
      'Did you use a condom last time you had sex?',
      'Did you take a pill today or yesterday?',
      'When did you get your last injection?',
      'When was your IUCD inserted?',
      'Which date did you get sterilised?',
      'Which date did your husband get sterilised?'
    ];
  };

  var getMessages = function() {
    return [
      'There are many family planning options to chose from.',
      'Make sure you use it every time and always keep an extra packet at home with you.',
      'Remember to take one pill each day and always keep an extra packet at home with you.',
      'Remember to go for another DMPA injection on 01/01/2016',
      'Remember to see a doctor to check or change your IUCD before 01/2015',
      '',
      'Use condoms or pills or abstain from sex until 01/07/2015 to make sure you do not get pregnant'
    ];
  };

  return {
    getFamilyPlanningMethods: getFamilyPlanningMethods,
    getQuestions: getQuestions,
    getMessages: getMessages
  }
});
