angular.module('uhiApp.services')
.factory('ChildService', ['FileService','UtilityService',function(FileService, UtilityService){
  var childrenList = FileService.readFromLocalStorage(false);
  var generateVisibleChildID = function(motherDisplayID) {
    var childNo = 0;
    // check if mother has other children
    angular.forEach(childrenList, function(childObj, index){
      if(childObj.motherDisplayID === motherDisplayID){
        childNo++;
      }
    });
    return motherDisplayID +"."+(childNo+1);
  }
  var generateActualChildID = function(motherID, name, dob) { 
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
   
    return motherID+nameCode+dobCode;
  }
  return {
    isChildRegistered: function(childID){
      //check if child is already registered
      for (var i = 0; i < childrenList.length; i++) {
        if(childID === childrenList[i].displayID) break;        
      }
      return i < childrenList.length;
    },
    isNewBorn : function(id) {
      var child = this.getChildDetails(id);
      var dob = child.dob;
      var days = UtilityService.calcAge(dob, false);
      if(days > 36*30){
        return 0; // this child is more than 3 years old
      } else if(days <=42){
        return 1; // child less than 42 days
      } else {
        return 2; // child less than 36 months
      }
    },
    getChildDetails : function(childID){
      for (var i = 0; i < childrenList.length; i++) {
        if(childID === childrenList[i].displayID) return childrenList[i];
        
      }
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
     var displayID = generateVisibleChildID(childObj.motherDisplayID); //house#.womanNo.childno
      var dateISO = UtilityService.convertToDate(childObj.dob).toISOString();
      childObj.dob = dateISO;
      childObj.childID = childID;
      childObj.displayID = displayID;
      childObj.city =UtilityService.getCityCode();
      childObj.slum =UtilityService.getSlumCode();
      childObj.worker = UtilityService.getWorkerCode();
      childObj.registrationDate = new Date();
      childObj.newBornDetails =[];
      childrenList.push(childObj);
      FileService.writeToLocalStorage(childrenList, false);
      console.log(childrenList);
      return displayID;
    },
    updateChildDetails: function(childObj){
      // update child details
      var childDetails = this.getChildDetails(childObj.displayID);
      angular.forEach(childObj, function(value, key){
        childDetails[key] = value;
      });
      FileService.writeToLocalStorage(childrenList, false);
    }
  }
}]);
