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
}]);
