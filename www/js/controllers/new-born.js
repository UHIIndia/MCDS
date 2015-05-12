angular.module('uhiApp.controllers')
.controller('newBornController',  function($scope, $state, $timeout, UtilityService, ChildService, videos){ 
  
  //get child Details  
  var activeRow = null; // this keeps a track of active row
   $scope.lastUpdated = {
    "weight": {},
    "ASHAVisit" : {},
    "ANMVisit" : {},
    "breastFeed" : {},
    "wrapCap" :{},
    "sick" :{},
    "temp" :{}
  }; //keeps last updated column for each row  
  $scope.rows = [
    {
      "name":"weight"
    },
    {
      "name":"ASHAVisit"
    },
     {
      "name":"ANMVisit"
    },
    {
      "name":"breastFeed"
    },
     {
      "name":"wrapCap"
    },
    {
      "name":"sick"
    } 
  ];
  // checks if a cell should be marked as red
  $scope.isRedCell = function (row, index) {
    var tempRedAlerts
   if($scope.rows[row].redAlerts){
      tempRedAlerts = angular.copy( $scope.rows[row].redAlerts);      
   } else {
     tempRedAlerts =[];
   } 
   tempRedAlerts.push($scope.rows[row].updatedRedAlert); 
      if(tempRedAlerts && tempRedAlerts.indexOf(index) >= 0){
        return true;
      }   
  }
  //init function when the view loads 
  function init(){
    var displayID = UtilityService.getChildDisplayID();
    console.log(displayID);
    // hard code display id for dev 
    //displayID ? displayID=displayID: displayID ="h1.1.1";
    if(!displayID){
      console.log('should not be here, child is not added in system');
    } else {
      // fetch child details 
      $scope.child = ChildService.getChildDetails(displayID);
      //$scope.child.newBornDetails = [];
      //set age for child  
      $scope.dobChild = UtilityService.convertDateFormat(new Date($scope.child.dob)); // child.dob is saved in ISO string
      setAge($scope.dobChild);
      if(!$scope.child.newBornDetails.length){
        // no details exist
        setDatesInHeader();
        initActionAlerts(false);
      } else {
        initActionAlerts(true);
      }
      // initialize action i.e mark yellow and red boxes for each row
      
      
    }
  }
  function initActionAlerts(isDetailsExist) {
    if(!isDetailsExist) {
      //set yellow boxes only
      setWeightYellowCell(-1);
      //set for others also
      setASHAVisitYellowCell(-1);
      setANMVisitYellowCell(-1);
      setBreastFeedYellowCell(-1);
      setSickYellowCell(-1);
    } else {
      setWeightYellowCell(getLatestSavedColumn($scope.rows[0].name));      
      setASHAVisitYellowCell(getLatestSavedColumn($scope.rows[1].name));
      setANMVisitYellowCell(getLatestSavedColumn($scope.rows[2].name));
      setBreastFeedYellowCell(getLatestSavedColumn($scope.rows[3].name));
      setSickYellowCell(getLatestSavedColumn($scope.rows[5].name));
      setRedCells($scope.rows[0].name);
      setRedCells($scope.rows[4].name);
      setRedCells($scope.rows[5].name);
    }    
  }
  function setRedCells(row) {
    var newBornDetails = $scope.child.newBornDetails;
    var length = newBornDetails.length;
    for(var i=length-1; i >= 0; i--){
      var val = newBornDetails[i][row];
      if(val !== undefined){ // this condition is used because false is also a value stored in data
        switch(row){
          case "weight" :
            setWeightRedCell(val, i);
            break;
          case "wrapCap" : 
            setWrapCapRedCell(val, i);
            break;
          case "sick" :
            setSickRedCell(val, i);
            break;
        }
      }
    }    
  }
  function getLatestSavedColumn(row) {
    var newBornDetails = $scope.child.newBornDetails;
    var length = newBornDetails.length;
    for(var i=length-1; i >= 0; i--){
      if(newBornDetails[i][row]){
        break;
      }
    }
    return i;
  }
  
  function getHighestCol(row) {
    var currCol= getColumn(UtilityService.convertDateFormat(new Date())),
     mostRecentSavedCol = getLatestSavedColumn(row),
      updatedCol = $scope.lastUpdated[row] ? $scope.lastUpdated[row].col : -1;
    var tempArr = [];
       if(currCol >= 0) tempArr.push(currCol);
       if(mostRecentSavedCol >= 0) tempArr.push(mostRecentSavedCol);
       if(updatedCol >= 0) tempArr.push(updatedCol);
       return tempArr.sort()[tempArr.length-1];
  }
  function setWeightYellowCell(col) {
    var highestCol = getHighestCol($scope.rows[0].name);
       if(col === -1){
         //default alert
         $scope.rows[0].yellowAlert = highestCol; //current Day
       }else if (highestCol < 13) {
        $scope.rows[0].yellowAlert = 13; //day14
       } else if(highestCol === 13){
         if($scope.child.newBornDetails[highestCol].weight ||($scope.lastUpdated.weight.col && $scope.lastUpdated.weight.col === highestCol)) {
           $scope.rows[0].yellowAlert = 27; //day28
         } else {
           $scope.rows[0].yellowAlert = 13; //day14
         }
       }else if (highestCol > 13 && highestCol < 27) {
        $scope.rows[0].yellowAlert = 27; //day28
       } else if(highestCol === 27){
          if($scope.child.newBornDetails[highestCol].weight || ($scope.lastUpdated.weight.col && $scope.lastUpdated.weight.col === highestCol)) {
           $scope.rows[0].yellowAlert = 28; //day42
         } else {
           $scope.rows[0].yellowAlert = 27; //day14
         }
       } else if(highestCol === 28){
          if($scope.child.newBornDetails[highestCol].weight || ($scope.lastUpdated.weight.col && $scope.lastUpdated.weight.col === highestCol)) {
           $scope.rows[0].yellowAlert = null; //no alert
         } else {
           $scope.rows[0].yellowAlert = 28; //day14
         }
       }     
  } 
  
  function setASHAVisitYellowCell(col) {
    var highestCol = getHighestCol($scope.rows[1].name);
       if(col === -1){
         //default alert
         $scope.rows[1].yellowAlert = highestCol; //current Day
       }else if (highestCol < 1) {
        $scope.rows[1].yellowAlert = 1; //day2
       } else if (highestCol === 1) {
         if($scope.child.newBornDetails[highestCol].ASHAVisit || ($scope.lastUpdated.ASHAVisit.col && $scope.lastUpdated.ASHAVisit.col === highestCol)) {
           $scope.rows[1].yellowAlert = 6; //day28
         } else {
           $scope.rows[1].yellowAlert = 1; //day14
         }
       }else if (highestCol > 1 && highestCol < 6) {
        $scope.rows[1].yellowAlert = 6; //day7
       } else if (highestCol === 6) {
         if($scope.child.newBornDetails[highestCol].ASHAVisit || ($scope.lastUpdated.ASHAVisit.col && $scope.lastUpdated.ASHAVisit.col === highestCol)) {
           $scope.rows[1].yellowAlert = 13; //day 14
         } else {
           $scope.rows[1].yellowAlert = 6; //day14
         }
       } else if(highestCol >6 && highestCol < 13){
        $scope.rows[1].yellowAlert = 13; //day14
       } else if (highestCol ===13) {
         if($scope.child.newBornDetails[highestCol].ASHAVisit || ($scope.lastUpdated.ASHAVisit.col && $scope.lastUpdated.ASHAVisit.col === highestCol)) {
           $scope.rows[1].yellowAlert = null; //day 14
         } else {
           $scope.rows[1].yellowAlert = 13; //day14
         }
       }else {
         $scope.rows[1].yellowAlert = null; //no alert
       } 
  }
  
  function setANMVisitYellowCell(col) {
    var highestCol = getHighestCol($scope.rows[2].name);
       if(col === -1){
         //default alert
         $scope.rows[2].yellowAlert = highestCol; //current Day
       }else if (highestCol < 13) {
        $scope.rows[2].yellowAlert = 13; //day14
       } else if(highestCol === 13){
         if($scope.child.newBornDetails[highestCol].ANMVisit || ($scope.lastUpdated.ANMVisit.col && $scope.lastUpdated.ANMVisit.col === highestCol)) {
           $scope.rows[2].yellowAlert = 27; //day28
         } else {
           $scope.rows[2].yellowAlert = 13; //day14
         }
       }else if (highestCol > 13 && highestCol < 27) {
        $scope.rows[2].yellowAlert = 27; //day28
       } else if(highestCol === 27){
          if($scope.child.newBornDetails[highestCol].ANMVisit || ($scope.lastUpdated.ANMVisit.col && $scope.lastUpdated.ANMVisit.col === highestCol)) {
           $scope.rows[2].yellowAlert = 28; //day42
         } else {
           $scope.rows[2].yellowAlert = 27; //day14
         }
       } else if(highestCol === 28){
          if($scope.child.newBornDetails[highestCol].ANMVisit || ($scope.lastUpdated.ANMVisit.col && $scope.lastUpdated.ANMVisit.col === highestCol)) {
           $scope.rows[2].yellowAlert = null; //no alert
         } else {
           $scope.rows[2].yellowAlert = 28; //day14
         }
       }     
  }
  
  function setBreastFeedYellowCell(col) {
    var currCol= getColumn(UtilityService.convertDateFormat(new Date())),
     mostRecentSavedCol = getLatestSavedColumn($scope.rows[3].name),
     latestVal;    
       if(col === -1){
         //default alert
         $scope.rows[3].yellowAlert = currCol; //current Day
       }else {         
         if (mostRecentSavedCol >=col) {
           latestVal = $scope.child.newBornDetails[mostRecentSavedCol].breastFeed
           if(latestVal === false){
             if(mostRecentSavedCol >= currCol)
             $scope.rows[3].yellowAlert = mostRecentSavedCol+1;
             else $scope.rows[3].yellowAlert = currCol;
           } else {
             $scope.rows[3].yellowAlert = null;
           }
          } else{
            latestVal = $scope.breastFeed;
            if(latestVal === false){
              if(col >= currCol)
                $scope.rows[3].yellowAlert = col+1;
              else $scope.rows[3].yellowAlert = currCol;
            } else {
              $scope.rows[3].yellowAlert = null;
            }
          } 
       }     
  }
  
  function setSickYellowCell(col) {
    var currCol = getColumn(UtilityService.convertDateFormat(new Date())),
     mostRecentSavedCol = getLatestSavedColumn($scope.rows[5].name),
     latestVal;        
    if(col < 0){
      //default current day is yellow
      $scope.rows[5].yellowAlert = currCol;
    } else{
      if(!$scope.rows[5].yellowAlert){
        latestVal = $scope.child.newBornDetails[col].sick; 
        if(latestVal === true) {
          if(currCol > col+1){
            $scope.rows[5].yellowAlert = currCol;
          } else {
            $scope.rows[5].yellowAlert = col+1;
          }
        }  
      } else {
        if(col >= mostRecentSavedCol){
          latestVal = $scope.sick;
          if(latestVal === true) {
          if(currCol > col+1){
            $scope.rows[5].yellowAlert = currCol;
          } else {
            $scope.rows[5].yellowAlert = col+1;
          }
        }  
        }      
      }
       
    }
  }
  
  function setWeightRedCell(val, col) {
    var prevColVal; 
    var redAlerts = $scope.rows[0].redAlerts? $scope.rows[0].redAlerts : [];
    var isUpdated = $scope.isValueUpdated('weight', col);
    if(val < 2.5){
      //check if red alerts is not empty and col does not exist in redAlerts
      if(isUpdated){
        $scope.rows[0].updatedRedAlert = col;
      } else {
        if(!redAlerts.length || redAlerts.indexOf(col) === -1){
        redAlerts.push(col);
        }
      }
      
    } else {
      // check the last entered prev val 
      for(var c = col-1; c >= 0; c--){
         var value = $scope.child.newBornDetails[c].weight;
        if(value) {
          prevColVal = value;
          break;
        }
      }
      if(val < prevColVal){
        if(isUpdated){
           $scope.rows[0].updatedRedAlert = col;
        } else {
          if(!redAlerts.length || redAlerts.indexOf(col) === -1){
          redAlerts.push(col);
          }
        }
        
      } else {
        if(isUpdated){
           $scope.rows[0].updatedRedAlert = -1;
        } else {
          if(redAlerts.length && redAlerts.indexOf(col) > -1){
        // remove this col from red alerts
          redAlerts.splice(redAlerts.indexOf(col), 1);
          }
        }
        
      }
    }
    $scope.rows[0].redAlerts = redAlerts;
  }
  
  function setWrapCapRedCell(val, col) {
   // red if weight/sick is red for this col and value is no
    var redAlerts = $scope.rows[4].redAlerts? $scope.rows[4].redAlerts : [];
    var isUpdated = $scope.isValueUpdated('wrapCap', col);
    var isWeightRed, isSickRed;    
    if(val === false) { 
      if(($scope.rows[0].redAlerts && $scope.rows[0].redAlerts.indexOf(col) > -1)||$scope.rows[0].updatedRedAlert === col){
        isWeightRed = true;
      } else {
        isWeightRed = false;
      }
      if(($scope.rows[5].redAlerts && $scope.rows[5].redAlerts.indexOf(col) > -1)||$scope.rows[5].updatedRedAlert === col){
        isSickRed = true;
      } else {
        isSickRed = false;
      }
      if(isWeightRed || isSickRed){
        if(isUpdated){
          $scope.rows[4].updatedRedAlert = col;
        } else if(!redAlerts.length || redAlerts.indexOf(col) === -1){
          redAlerts.push(col);
        } 
      }            
      
    } else {
      if(isUpdated) {
        $scope.rows[4].updatedRedAlert = -1;
      } else if(redAlerts.length && redAlerts.indexOf(col) > -1){
        // remove this col from red alerts
          redAlerts.splice(redAlerts.indexOf(col), 1);
        }
    }
    $scope.rows[4].redAlerts = redAlerts;
  }  
  
  function setSickRedCell(val, col) {
    var redAlerts = $scope.rows[5].redAlerts? $scope.rows[5].redAlerts : [];
    var isUpdated = $scope.isValueUpdated('sick', col);
    if(val) {
      if(isUpdated){
        $scope.rows[5].updatedRedAlert = col;
      } else if(!redAlerts.length || redAlerts.indexOf(col) === -1){
        redAlerts.push(col);
      }
    } else {
      if(isUpdated){
        $scope.rows[5].updatedRedAlert = -1;
      } else if(redAlerts.length && redAlerts.indexOf(col) > -1){
        // remove this col from red alerts
          redAlerts.splice(redAlerts.indexOf(col), 1);
        }
    }
    $scope.rows[5].redAlerts = redAlerts;
  }
  
  function setAge(dob) {
    // dob is "dd/mm/yyyy"
    var days= UtilityService.calcAge(dob, false);
    $scope.child.ageMonths = parseInt(days/30);
    $scope.child.ageDays = days%30;
  }
  
  function setDatesInHeader() {
    var dob = UtilityService.convertToDate($scope.dobChild);
    var days= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 42]; 
    //var days= [1, 2, 3, 4, 5, 6, 7];
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
      return '../img/children/boy.png';
    } else {
      return '../img/children/girl.png';
    }
  }
  /* calender Related Methods*/
 
  $scope.dateFormat = "dd/MM/yyyy";
  $scope.getMaxDate = function() {
   // max date is last date in new born details array last entry
    var lastDateStr = $scope.child.newBornDetails[$scope.child.newBornDetails.length -1].date;
    var lastDate = UtilityService.convertToDate(lastDateStr);
    var currDate = new Date();
    if(currDate - lastDate > 0){
      // return last date as max date 
       return lastDateStr.split('/').reverse().join('-'); 
    } else {
      return currDate.getFullYear()+"-"+(currDate.getMonth()+1)+"-"+currDate.getDate();
    }
     
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
  
  $scope.isValueUpdated = function (row, col){
    try{
      if($scope.lastUpdated[row].col === col){
        return true;
      } else return false;
      
    } catch (e){
      return false;
      }
    
  }
  function setLastUpdated(row, col){
   /* var prevCol = $scope.lastUpdated[row].col;
    if(prevCol>=0){
          //remove the previously set value       
          $scope.child.newBornDetails[prevCol][row]=null; 
    }*/
    $scope.lastUpdated[row]={
      "col" : col,
      "val" : $scope[row]
    };
  }
  
  $scope.watchHandler0 = function() {
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
  };
  $scope.$watch('weightDate', $scope.watchHandler0);  
   
  function setWeightValue(date, col) {         
      // check if a there is a value for weight
      if($scope.weight){
        //set last updated col for this row
        setLastUpdated('weight',col);        
         //set action alerts 
        setWeightYellowCell(col);
        setRedCells($scope.rows[0].name);
        setWeightRedCell($scope.weight, col);
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
    if($scope.ASHAVisit === undefined || $scope.ASHAVisit === null){
      return ;
    }
     setLastUpdated('ASHAVisit',col);
      // can apply separate logic for each row      
     setASHAVisitYellowCell(col);
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
     if($scope.ANMVisit === undefined || $scope.ANMVisit === null){
      return ;
    }
    //var dayOfDetail = $scope.child.newBornDetails[col];
      setLastUpdated('ANMVisit',col);      
     //dayOfDetail.ANMVisit = $scope.ANMVisit;
     setANMVisitYellowCell(col);
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
    if($scope.breastFeed === undefined || $scope.breastFeed === null){
      return ;
    }
   // var dayOfDetail = $scope.child.newBornDetails[col];
       setLastUpdated('breastFeed',col);
     // dayOfDetail.breastFeed = $scope.breastFeed;
      //
      setBreastFeedYellowCell(col);
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
    if($scope.wrapCap === undefined || $scope.wrapCap === null){
      return ;
    }
    //var dayOfDetail = $scope.child.newBornDetails[col];
     setLastUpdated('wrapCap',col);
   //   dayOfDetail.wrapCap = $scope.wrapCap;
      //
    setRedCells($scope.rows[4].name);
     setWrapCapRedCell($scope.wrapCap, col);
  }
  $scope.watchHandler5 = function () {
    if($scope.sickDate){
      console.log('sickDate: '+ $scope.sickDate +" active row :"+activeRow);
    var dateStr = UtilityService.convertDateFormat($scope.sickDate);
    var col = getColumn(dateStr);    
    // set value for selected grid
    col>=0 ? setSickDateValue(dateStr, col): alert('Please select a valid date from calender');      
    }    
  };
  $scope.$watch('sickDate', $scope.watchHandler5);
  $scope.$watch('sick', $scope.watchHandler5);
  function setSickDateValue(date, col) {
    if($scope.sick === undefined || $scope.sick === null){
      return ;
    }
    //var dayOfDetail = $scope.child.newBornDetails[col];
    setLastUpdated('sick',col);
    if($scope.temp){
     setLastUpdated('temp', col); 
    } 
      //
    setSickYellowCell(col);
    setRedCells($scope.rows[5].name);
    setSickRedCell($scope.sick, col);
  } 
  
  $scope.navigateToMotherFP = function() {
    // set mother's visible/display ID
    UtilityService.setWomanDisplayID($scope.child.motherDisplayID).then(
      function(success){
        $state.go('fp');
      }, function(err){});
    
  };
  
  $scope.navigateToChildImmunization = function() {
    $state.go('immunisation');
  };
  
  $scope.saveDetails = function() {
    //update in new born details 
    for(var prop in $scope.lastUpdated){
      var col = $scope.lastUpdated[prop].col;
      var val = $scope.lastUpdated[prop].val;
      if(col >=0 && val){
         $scope.child.newBornDetails[col][prop] = val;
      }     
    }
    ChildService.updateChildDetails($scope.child);
    //initialize last updated
    $scope.lastUpdated ={
    "weight": {},
    "ASHAVisit" : {},
    "ANMVisit" : {},
    "breastFeed" : {},
    "wrapCap" :{},
    "sick" :{},
    "temp" :{}
    };
    //set date as null
    $scope.weightDate = null;
    $scope.ASHAVisitDate = null;
    $scope.ANMVisitDate = null;
    $scope.breastFeedDate = null;
    $scope.wrapCapDate = null;
    $scope.sickDate = null;   
    alert('saved successfully');
  };
  
  // video section starts here 
  var childVideos = videos.getChildVideos();
  $scope.video ={};
  $scope.video.show = false;
  $scope.video.stop = function() {
    var videoElem = document.getElementById('video_nb');
    videoElem.pause();
    $scope.video.show = false;
  };
  $scope.video.play = function(id) {
   // $scope.video.path = "videos/sample.mp4";
    $scope.video.path = childVideos[id+1].path;
    $scope.video.show = true;
    $timeout(function() {
      var videoElem = document.getElementById('video_nb');
      videoElem.play();
    }, 1000);
  }
  // video section ends here 
  
});
