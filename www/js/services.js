angular.module('starter.services', [])

.factory('FileService', function(){
  var jsonFilePath="";  
  var localStorageKey = 'UHI_MCAS';
  function initStorage(){
    // this is temprory
    console.log('No data has been imported to system, Initializing manually for now');
       var obj = { 
        womanArray :[],
        childArray :[]
       }
       localStorage[localStorageKey] =JSON.stringify(obj);     
  }
 //initStorage();
  if(localStorage && !localStorage[localStorageKey]){
    initStorage();
  }
  
  return {
    readFromLocalStorage: function(isWoman){
      var lsData=localStorage[localStorageKey]; // this will Json file data      
      var jsonObj = JSON.parse(lsData);
      if(isWoman){
        return jsonObj.womanArray ? jsonObj.womanArray: [];
      }else{
        //get children list
        return jsonObj.childArray ? jsonObj.childArray : [];
      }
      //read file from json file path and return women list
    },
    writeToLocalStorage: function(list, isWoman){
      var lsData=localStorage[localStorageKey]; // this will Json file data
      if(lsData === undefined){
       // alert('No data has been imported to system');
        return;       
      }
      var jsonObj = JSON.parse(lsData);
      if(isWoman){
        //write women List to json file 
        jsonObj.womanArray = list;
      } else {
        //write child List to json file 
        jsonObj.childArray = list;
      }
      
      localStorage[localStorageKey] = JSON.stringify(jsonObj);
    },
    importToLocalStorage : function  (argument) {
      // get data from a json file to local storage
      //hard coding for now : kamlesh 9th april.. need to be changed later
    },
    exportToFile : function (argument) {
      // write data from local storage to file
    }
  }
})
.factory('WomanService',['FileService','UtilityService', function(FileService, UtilityService){
  var womenList = FileService.readFromLocalStorage(true);
  // this function return a id i.e house#.womanNo , this will be visible to user 
  var generateVisibleWomanID = function(houseCode){
    var womanNo=0; //  is the number of woman in a particular house
       // find if this house is already present in the list
       angular.forEach(womenList, function(womanObj, index){
          if(womanObj.house == houseCode){
            womanNo++;
          }
       });
      return houseCode+"."+(womanNo+1);
  };
  // this function return a id i.e house#.womanNo , this will be visible to user 
  var generateActualWomanID = function(name, dob){  
   var nameCode, dobCode;
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
   
      return UtilityService.getCityCode()+UtilityService.getSlumCode()+UtilityService.getWorkerCode()+nameCode+dob.getDate()+dob.getMonth()+dob.getFullYear();
  };
  return {
    isWomanRegistered: function(womanID){
      // check if this woman is already in women list or not
    },
    getWomanDetails: function(womanID){
      // get the details of woman from all women list
      for(var i=0; i<womenList.length; i++){
        if(womanID === womenList[i].visibleID){
          return womenList[i];
        }
      }
    },
    updateWomanDetails: function(womanObj){
      // save woman related details to 
      var womanDetails = this.getWomanDetails(womanObj.womanID);
      angular.forEach(womanObj, function(value, key){
        
          womanDetails[key] = value;
      
      });
    },
    addNewWoman: function (womanObj) {
      var womanID = generateActualWomanID(womanObj.name, womanObj.dob);
      var visibleID = generateVisibleWomanID(womanObj.house);
      // add this woman to women List
      womanObj.womanID = womanID;
      womanObj.visibleID = visibleID;
      womanObj.city =UtilityService.getCityCode();
      womanObj.slum =UtilityService.getSlumCode();
      womanObj.worker = UtilityService.getWorkerCode();
      womanObj.registrationDate = new Date();
      womenList.push(womanObj);      
      FileService.writeToLocalStorage(womenList, true);
        console.log(womenList);
        return womanID;      
    }
  }
}])
.factory('ChildService', ['FileService','UtilityService',function(FileService, UtilityService){
  var childrenList = FileService.readFromLocalStorage(false);
  var generateVisibleChildID = function(mothersVisibleID) {
    var childNo = 0;
    // check if mother has other children
    angular.forEach(childrenList, function(childObj, index){
      if(childObj.mothersVisibleID === mothersVisibleID){
        childNo++;
      }
    });
    return mothersVisibleID +"."+(childNo+1);
  }
  var generateActualChildID = function(motherID, name, dob) { 
    var nameCode;
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
    return motherID+nameCode+dob.getDate()+dob.getMonth()+dob.getFullYear();;
  }
  return {
    isChildRegistered: function(childID){
      //check if child is already registered
    },
    getChildDetails : function(childID){
      for (var i = 0; i < childrenList.length; i++) {
        if(childID === childrenList[i].visibleID) return childrenList[i];
        
      };
    },
    getChildren : function(motherID){
      var children = [];
      for (var i = 0; i < childrenList.length; i++) {
        if(motherID === childrenList[i].motherID) children.push(childrenList[i]);        
      };
      return children;
    },
    addNewChild : function(childObj){
     var childID = generateActualChildID(childObj.motherID, childObj.name, childObj.dob); // motherID + AR1502015
     var visibleID = generateVisibleChildID(childObj.mothersVisibleID); //house#.womanNo.childno
      childObj.childID = childID;
      childObj.visibleID = visibleID;
      childObj.city =UtilityService.getCityCode();
      childObj.slum =UtilityService.getSlumCode();
      childObj.worker = UtilityService.getWorkerCode();
      childObj.registrationDate = new Date();
      childrenList.push(childObj);
      FileService.writeToLocalStorage(childrenList, false);
      console.log(childrenList);
      return childID;
    },
    updateChildDetails: function(childObj){
      // update child details
      var childDetails = this.getChildDetails(childObj.childID);
      angular.forEach(childObj, function(value, key){
        childDetails[key] = value;
      });
    }
  }
}])
.factory('UtilityService',function(){
  var cityCode="500", slumCode="200", workerCode="100";

  return {
   alertMessages: {
      liveBirth: 'Live births can not be greater than total pregnencies',
      livingChildren: 'Living Children can not be greater than number of children birth alive'
    },
    getSlumCode: function(){
      return slumCode;
    },
    getCityCode: function(){
      return cityCode;
    },
    getWorkerCode: function(){
     return workerCode;
    },
     calcAge: function(dob, inYear){
        var currDate =new Date(),
        diffYear = currDate.getFullYear() - dob.getFullYear(),
        diffMonth = currDate.getMonth() - dob.getMonth();
        if(inYear){
          // age is calculated in years 
          return diffYear;
        } else{
          //age is Calculated in months
          return 12 * diffYear + diffMonth;       

        }       
    
    },
    calcDob : function(age,inYear){
      var currDate= new Date(),
      currYear=currDate.getFullYear(),
      currMonth =currDate.getMonth() ;      
      if(inYear){
        //return new Date("Jan,15,"+currYear - age);
        return new Date(currYear-age +"-01-15");//
      } else {
        //age value is in months
        var year = parseInt(age/12), month=age%12, monthDiff = currMonth - month;
        if(monthDiff>0){
          return new Date(currYear - year+"-"+monthDiff+"-15");
        } else{
          return new Date(currYear - year - 1+"-"+(12+monthDiff)+"-15");
        }
      }
            
    },
    addDaysToDate : function(dateObj, days){
      var dat = new Date(dateObj.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }, 
    subtractDaysFromDate : function(dateObj, days){
      var dat = new Date(dateObj.valueOf());
      dat.setDate(dat.getDate() - days);
      return dat;
    },
    isSameDate : function(date1, date2){
      //only  checking day month and year
      return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate());
    },
    generateWomanID: function(houseCode, womanNo){
      return cityCode+slumCode+workerCode+houseCode+womanNo;
    },
    showMonthFromDate:function(date){
        var dateArray = date.split("/");
        return dateArray[1];
    },
    convertDateFormat:function(date){
        var day=date.getDate();
        var month=date.getMonth()+1;
        var year=date.getFullYear();
        return day+"/"+month+"/"+year;
    },
    showMonth:function(monthNo){

        switch(monthNo) {
        case 1:
        case 01:
            return "Jan"
            break;
        case 2:
        case 02:
            return "Feb"
            break;
        case 3:
        case 03:
            return "Mar"
            break;
        case 4:
        case 04:
            return "Apr"
            break;
        case 5:
        case 05:
            return "May"
            break;
        case 6:
        case 06:
            return "Jun"
            break;
        case 7:
        case 07:
            return "Jul"
            break;
        case 8:
        case 08:
            return "Aug"
            break;   
        case 9:
        case 09:
            return "Sep"
            break;
        case 10:
            return "Oct"
            break;
        case 11:
            return "Nov"
            break;
        case 12:
            return "Dec"
            break;
        default:
            return "Jan"
      }
    }
  }
});
