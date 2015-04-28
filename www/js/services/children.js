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
      return days <= 42 ;
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
      return childID;
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
