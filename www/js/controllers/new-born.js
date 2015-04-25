angular.module('uhiApp.controllers')
.controller('newBornController',  function($scope, $state, $timeout, UtilityService, ChildService){ 
  
  //get child Details  
  function init(){
    var displayID = UtilityService.getChildDisplayID();
    console.log(displayID);
    // hard code display id for dev 
    displayID = "H-1.1.1";
    if(!displayID){
      console.log('should not be here, child is not added in system');
    } else {
      // fetch child details 
      $scope.child = ChildService.getChildDetails(displayID);
      $scope.child.newBornDetails = [];
      //set age for child  
      setAge();
      setDatesInHeader();
    }
  }
  function setAge() {
    var days= UtilityService.calcAge($scope.child.dob, false);
    $scope.child.ageMonths = parseInt(days/30);
    $scope.child.ageDays = days%30;
  }
  function setDatesInHeader() {
    var dob = UtilityService.convertToDate($scope.child.dob);
    var days= [1, 2, 3, 7, 14, 21, 28, 42];    
    angular.forEach(days, function(day, index){
      var date = UtilityService.convertDateFormat(UtilityService.addDaysToDate(dob, day-1));
      var obj ={day: day, date: date};
      $scope.child.newBornDetails.push(obj);
    });
    //$scope.headerDates = headerDates;
  }
  
  init();
  $scope.getChildIcon = function(){
    if($scope.child.sex === 'M'){
      return 'icon-boy';
    } else {
      return 'icon-girl';
    }
  }
  /* calender Related Methods*/
  $scope.calenders = {
    "0" : null,
    "1" : null,
    "2" : null,
    "3" : null,
    "4" : null
  }
  $scope.dateFormat = "dd/MM/yyyy";
  $scope.getMaxDate = function() {
   // max date is last date in new born details array last entry
    var lastDate = $scope.child.newBornDetails[$scope.child.newBornDetails.length -1].date;
    
    return lastDate.split('/').reverse().join('-');   
  };
  
   $scope.getMinDate = function() {
   // min date is firt date in new born details array last entry
    var firstDate = $scope.child.newBornDetails[0].date;     
    return firstDate.split('/').reverse().join('-');    
  };
  
  $scope.isOpenPosition = {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false
  };  
  $scope.openCalender = function($event, rowNo) {
   $event.preventDefault();
   $event.stopPropagation();
    $scope.isOpenPosition[rowNo] = true;    
   };
/* calender methods ends here--  */
  $scope.navigateToChildImmunization = function() {
    $state.go('immu');
  };
  
  $scope.navigateToMotherFP = function() {
    // set mother's visible/display ID
    UtilityService.setWomanDisplayID($scope.child.motherDisplayID);
    $state.go('fp');
  };
  
  $scope.saveDetails = function() {
    ChildService.updateChildDetails($scope.child);
  };
  $scope.video ={};
  $scope.video.show = false;
  $scope.video.stop = function() {
    var videoElem = document.getElementById('video_nb');
    videoElem.pause();
    $scope.video.show = false;
  };
  $scope.video.play = function(id) {
    $scope.video.path = "videos/sample.mp4";
    $scope.video.show = true;
    $timeout(function() {
      var videoElem = document.getElementById('video_nb');
      videoElem.play();
    }, 1000);
  }
  
});