angular.module('uhiApp.controllers')
.controller('newBornController',  function($scope, $state, $timeout, UtilityService, ChildService){ 
  
  //get child Details  
  var activeRow = null; // this keeps a track of active row
 
  function init(){
    var displayID = UtilityService.getChildDisplayID();
    console.log(displayID);
    // hard code display id for dev 
    displayID = "zz.1.1";
    if(!displayID){
      console.log('should not be here, child is not added in system');
    } else {
      // fetch child details 
      $scope.child = ChildService.getChildDetails(displayID);
      //$scope.child.newBornDetails = [];
      //set age for child  
      setAge();
      if(!$scope.child.newBornDetails.length){
        setDatesInHeader();
      }
      // initialize action 
    }
  }
  function setAge() {
    var days= UtilityService.calcAge($scope.child.dob, false);
    $scope.child.ageMonths = parseInt(days/30);
    $scope.child.ageDays = days%30;
  }
  function setDatesInHeader() {
    var dob = UtilityService.convertToDate($scope.child.dob);
   // var days= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 42]; 
    var days= [1, 2, 3, 4, 5, 6, 7];
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
    $state.go('immunisation');
  };
  
  // grid methods 
  // method returns column based on a date string 
  function getColumn(dateStr) {
    var col;
    angular.forEach($scope.child.newBornDetails, function(detail, index){
      if(detail.date === dateStr) {
        col = index;
        return;
      }
    }); 
    return col;
  }
  // check if column is last column
  function isLastColumn(col) {
    if($scope.child.newBornDetails.length - 1 > col)
      return false;
      return true;
  }
  var lastUpdated ={}; //keeps last updated column for each row
  $scope.alerts ={}; // keeps action alert col for each row
  
  function setLastUpdated(row, col){
    var prevCol = lastUpdated[row];
    if(prevCol>=0){
          //remove the previously set value       
          $scope.child.newBornDetails[prevCol][row]=null; 
    }
    lastUpdated[row] = col;
  }
  $scope.$watch('weightDate', watchHandler0);
  $scope.$watch('weight', watchHandler0);
   function watchHandler0(){
    if($scope.weightDate){
      console.log('weightDate: '+ $scope.weightDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.weightDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    if(col>=0) {
      setWeightValue(dateStr, col);           
    } else {
      alert('Please select a valid date from calender');     
    }
    }    
  }
   function setWeightValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];       
      // check if a there is a value for weight
      if($scope.weight){
        //set last updated col for this row
        setLastUpdated('weight',col);
        dayOfDetail.weight = $scope.weight;
         //set action alert 
        if(!isLastColumn(col)){
          $scope.alerts['weight'] = col+1;
        }else {
          $scope.alerts['weight'] = null;
        }
        // 
      }    
  }
  
  $scope.$watch('ASHAVisitDate', watchHandler1);
  $scope.$watch('ASHAVisit', watchHandler1);
  function watchHandler1(){
    if($scope.ASHAVisitDate){
      console.log('ASHAVisitDate: '+ $scope.ASHAVisitDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.ASHAVisitDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setASHAVisitValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  }
   function setASHAVisitValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col]; 
     setLastUpdated('ASHAVisit',col);
      // can apply separate logic for each row  
      //dayOfDetail.ASHAVisit = date;
     dayOfDetail.ASHAVisit = $scope.ASHAVisit;
      //
    
  }
  
  $scope.$watch('ANMVisitDate', watchHandler2);
  $scope.$watch('ANMVisit', watchHandler2);
  function watchHandler2(){
    if($scope.ANMVisitDate){
      console.log('ANMVisitDate: '+ $scope.ANMVisitDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.ANMVisitDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setANMVisitValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  }
   function setANMVisitValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];
      setLastUpdated('ANMVisit',col);      
     dayOfDetail.ANMVisit = $scope.ANMVisit;
      //
    
  }
  
  $scope.$watch('breastFeedDate', watchHandler3);
  $scope.$watch('breastFeed', watchHandler3);
  function watchHandler3(){
    if($scope.breastFeedDate){
      console.log('breastFeedDate: '+ $scope.breastFeedDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.breastFeedDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setBreastFeedDateValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  }
   function setBreastFeedDateValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];
       setLastUpdated('breastFeed',col);
      dayOfDetail.breastFeed = $scope.breastFeed;
      //
    
  }
  
  $scope.$watch('wrapCapDate', watchHandler4);
  $scope.$watch('wrapCap', watchHandler4);
  function watchHandler4(){
    if($scope.wrapCapDate){
      console.log('wrapCapDate: '+ $scope.wrapCapDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.wrapCapDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setWrapCapDateValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  }
   function setWrapCapDateValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];
     setLastUpdated('wrapCap',col);
      dayOfDetail.wrapCap = $scope.wrapCap;
      //
    
  }
  
  $scope.$watch('sickDate', watchHandler5);
  $scope.$watch('sick', watchHandler5);
  function watchHandler5(){
    if($scope.sickDate){
      console.log('sickDate: '+ $scope.sickDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.sickDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setSickDateValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  }
   function setSickDateValue(date, col) {
    var dayOfDetail = $scope.child.newBornDetails[col];
    setLastUpdated('sick',col);
      dayOfDetail.sick = $scope.sick;
      //
    
  } 
  
  $scope.navigateToMotherFP = function() {
    // set mother's visible/display ID
    UtilityService.setWomanDisplayID($scope.child.motherDisplayID).then(
      function(success){
        $state.go('fp');
      }, function(err){});
    
  };
  
  $scope.saveDetails = function() {
    ChildService.updateChildDetails($scope.child);
    //initialize last updated
    lastUpdated ={};
    alert('saved successfully');
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