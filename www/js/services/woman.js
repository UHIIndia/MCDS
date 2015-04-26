angular.module('uhiApp.services')
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
    var nameCode,dobCode; 
    if(angular.isDate(dob)){
      var dd= dob.getDate(), mm=dob.getMonth()+1, yyyy= dob.getFullYear();
      if(dd< 10)  dd ="0"+ dd;
      if(mm < 10) mm ="0"+mm;
      dobCode = dd+mm+yyyy;
    } else {
      //its a dd/mm/yyyy string
      dobCode = dob.replace(/\//g, "");
    }
   
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
   
      return UtilityService.getCityCode()+UtilityService.getSlumCode()+UtilityService.getWorkerCode()+nameCode+dobCode;
  };
  return {
    isWomanRegistered: function(womanID){
      // check if this woman is already in women list or not
    },
    getWomanDetails: function(womanID){
      // get the details of woman from all women list
      for(var i=0; i<womenList.length; i++){
        if(womanID === womenList[i].displayID){
          return womenList[i];
        }
      }
    },
    updateWomanDetails: function(womanObj){
      // save woman related details to 
      var womanDetails = this.getWomanDetails(womanObj.displayID);
      angular.forEach(womanObj, function(value, key){        
          womanDetails[key] = value;      
      });
      FileService.writeToLocalStorage(womenList, true);
    },
    addNewWoman: function (womanObj) {
      var womanID = generateActualWomanID(womanObj.name, womanObj.dob);
      var displayID = generateVisibleWomanID(womanObj.house);
      // add this woman to women List
      womanObj.womanID = womanID;
      womanObj.displayID = displayID;
      womanObj.city =UtilityService.getCityCode();
      womanObj.slum =UtilityService.getSlumCode();
      womanObj.worker = UtilityService.getWorkerCode();
      womanObj.registrationDate = new Date();
      womanObj.isCurrentlyBreastFeeding = null;
      womanObj.familyPlanningVisits = null;
      womanObj.LMP = null;
      womanObj.EDD = null;
      womanObj.deliveryDate = null;
      womanObj.maternalOutcome = null;
      womanObj.birthOutcome = womanID;
      womanObj.FPMethod = displayID;
      womanObj.ANC = null;
      womanObj.slum = null;
      womanObj.worker = null;
      womanObj.registrationDate = null;
      womanObj.isCurrentlyBreastFeeding = null;
      womanObj.familyPlanningVisits = null;
      womanObj.LMP = null;
      womanObj.EDD = null;
      womanObj.deliveryDate = null;
      womanObj.maternalOutcome = null;
      womenList.push(womanObj);      
      FileService.writeToLocalStorage(womenList, true);
        console.log(womenList);
        return womanID;      
    }
  }
}]);
