angular.module('uhiApp.services')
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
    if(!angular.isDate(dob)){
      //its a dd/mm/yyyy string 
      var arr = dob.split('/');
      var mmddyyyyStr = arr[1]+"/"+arr[0]+"/"+arr[2];
      dob = new Date(mmddyyyyStr);
    } 
    var nameCode, dd= dob.getDate(), mm=dob.getMonth()+1, yyyy= dob.getFullYear();
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
   if(dd < 10)  dd ="0"+ dd;;
   if(mm < 10) mm ="0"+mm;
    return motherID+nameCode+dd+mm+yyyy;
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
      var childDetails = this.getChildDetails(childObj.visibleID);
      angular.forEach(childObj, function(value, key){
        childDetails[key] = value;
      });
      FileService.writeToLocalStorage(childrenList, false);
    }
  }
}]);
