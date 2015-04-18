angular.module('starter.services')
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
}]);
