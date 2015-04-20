angular.module('starter.services')
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
    if(!angular.isDate(dob)){
      //its a dd/mm/yyyy string 
      var arr = dob.split('/');
      var mmddyyyyStr = arr[1]+"/"+arr[0]+"/"+arr[2];
      dob = new Date(mmddyyyyStr);
    } 
   var nameCode, dd= dob.getDate(), mm=dob.getMonth()+1, yyyy= dob.getFullYear();
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
   if(dd< 10)  dd ="0"+ dd;;
   if(mm < 10) mm ="0"+mm;
      return UtilityService.getCityCode()+UtilityService.getSlumCode()+UtilityService.getWorkerCode()+nameCode+dd+mm+yyyy;
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
      var womanDetails = this.getWomanDetails(womanObj.visibleID);
      angular.forEach(womanObj, function(value, key){        
          womanDetails[key] = value;      
      });
      FileService.writeToLocalStorage(womenList, true);
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
}]);
