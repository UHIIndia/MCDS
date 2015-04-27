angular.module('uhiApp.controllers')
.controller('newBornController',  function($scope, $state, $timeout, UtilityService, ChildService){ 
  
  //get child Details  
  var activeRow = null; // this keeps a track of active row
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
    "4" : null,
    "5" : null
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
    "4": false,
    "5": false
  };  
  $scope.openCalender = function($event, rowNo) {
   $event.preventDefault();
   $event.stopPropagation();
    activeRow = rowNo;
    $scope.isOpenPosition[rowNo] = true;    
   };
/* calender methods ends here--  */
  $scope.navigateToChildImmunization = function() {
    $state.go('immu');
  };
  
  // grid methods
  // rows maintains keys
  var rows ={
    "0" : "weight",
    "1" : "ASHAVisit",
    "2" : "ANMVisit",
    "3" : "breastFeed",
    "4" : "wrapCap",
    "5" : "sick"
  };
  
  var selectGrid = function(row) {
    if(!$scope.calenderDate){
      console.log('Please select a date from calender');
      return;
    }
    var dateStr = UtilityService.convertDateFormat($scope.calenderDate);
    var col;
    angular.forEach($scope.child.newBornDetails, function(detail, index){
      if(detail.date === dateStr) {
        col = index;
        return;
      }
    }); 
    
    // set value for selected grid
    col>=0 ? setValue(dateStr, col): alert('Please select a valid date from calender');
  
  };
  
  $scope.$watch('calenderDate', function() {
    console.log('check watch');
    selectGrid();
  })
  
  function setValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];
    var key = rows[activeRow];
    if(activeRow === '0'){
      // check if a there is a value for weight
      if($scope.weight){
        dayOfDetail[key] = $scope.weight;
        $scope.calenderDate = null; 
      } else alert('Please select weight for child');
    } else {
      // can apply separate logic for each row  
      dayOfDetail[key] = date;
      $scope.calenderDate = null;
    }
  }
  
  $scope.navigateToMotherFP = function() {
    // set mother's visible/display ID
    UtilityService.setWomanDisplayID($scope.child.motherDisplayID);
    $state.go('fp');
  };
  
  $scope.saveDetails = function() {
    ChildService.updateChildDetails($scope.child);
  };
  
  // video section starts here 
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
  // video section ends here 
  
});