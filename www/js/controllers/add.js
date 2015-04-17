angular.module('starter.controllers')
.controller('AddController', ['$scope','$location','$stateParams','WomanService','ChildService','UtilityService', '$cordovaCamera',function ($scope, $location, $stateParams, WomanService, ChildService, UtilityService, $cordovaCamera){
    if($stateParams.id){
        $scope.woman = WomanService.getWomanDetails($stateParams.id);
        //get children for this woman
        if($scope.woman){
            // update age for woman
            $scope.woman.age = (function(){
                if($scope.woman.dob){
                    $scope.woman.dob = new Date($scope.woman.dob);
                    return UtilityService.calcAge($scope.woman.dob, true);
                }
            }());
            $scope.children = ChildService.getChildren($scope.woman.womanID);
            angular.forEach($scope.children, function(childObj, index){
                childObj.dob = new Date(childObj.dob);
                childObj.age = UtilityService.calcAge(childObj.dob, false);
            });
        } else {
            alert("Woman Not in list, Navigating back to home page");
            $location.path("/home");
        }
    } else{
        $scope.woman ={};
        $scope.children=[{}];
        $scope.savedChildren =[];
    }
    // For auto updating of age

// setting age based on dob
    $scope.setAge = function(inYear, index){
        var dob;
        if(inYear){
            dob = $scope.woman.dob;
            if(dob) $scope.woman.age = UtilityService.calcAge(dob, inYear);
        } else {
            var child = $scope.children[index];
            dob = child.dob;
            if(dob) child.age = UtilityService.calcAge(dob, inYear);
        }

    };

//setting dob based on age
    $scope.setDob = function(inYear, index){
        var age;
        if(inYear){
            //this is for woman
            age= $scope.woman.age;
            if(age){
                $scope.woman.dob = UtilityService.calcDob(age, inYear);
            }
        } else{
            //this is for child
            var child = $scope.children[index];
            age = child.age;
            if(age) child.dob = UtilityService.calcDob(age, inYear);
        }


    }
//function for setting Expected delivery date based on LMP
    $scope.setEDD = function(){
        if($scope.woman.currentPreg){
            var LMPDate = $scope.woman.currentPreg.LMP,
                isEligibleForEDD,
                currDate = new Date(),
                ineligibleDate;  //an edd is set only if lmp is 45 days before the current date

            if(LMPDate){
                ineligibleDate = UtilityService.addDaysToDate(LMPDate, 44);
                // if current date is equal to or greater than in eligible date then set edd after 40 weeks of LMP date
                isEligibleForEDD = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()).getTime() - ineligibleDate.getTime() >= 0;
                if(isEligibleForEDD){
                    $scope.woman.currentPreg.EDD = UtilityService.addDaysToDate(LMPDate, 279);
                } else{
                    $scope.woman.currentPreg.EDD ="";
                }

            }
        }

    };

    $scope.setLMP = function(){
        if($scope.woman.currentPreg){
            var EDDDate = $scope.woman.currentPreg.EDD,
            //isEligibleForEDD,
                currDate = new Date();  //an edd is set only if lmp is 45 days before the current date

            if(EDDDate){
                $scope.woman.currentPreg.LMP = UtilityService.subtractDaysFromDate(EDDDate, 279);

            }
        }
    }
// function for capturing image from cam
    $scope.captureImage = function($event){
        document.addEventListener("deviceready", function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                // var image = document.getElementById('myImage');
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                // saving this data as a jpeg file in system

            }, function(err) {
                // error
                alert("Error in Image capture:"+err);
            });

        }, false);
    };

// method for saving all the details
    $scope.saveDetails = function($event){
        var errorMsg = $scope.validations.validateSave();
        if(errorMsg){
            alert(errorMsg);
            return;
        }
        if(!$scope.woman.womanID){
            //add new woman and new children in woman liat and child list
            $scope.woman.womanID = WomanService.addNewWoman($scope.woman);
        } else {
            // this is an update
            WomanService.updateWomanDetails($scope.woman);
        }

        // sort saved children on age youngest to oldest
        $scope.children.sort(function(childA, childB){
            return childA.age - childB.age;
        });
        //display saved children
        //$scope.savedChildren=angular.copy($scope.children);
        $scope.savedChildren = [];
        angular.forEach( $scope.children, function(childObj, index){
            if(childObj.name){
                var mother= $scope.woman;
                childObj.motherID = mother.womanID;
                childObj.mothersVisibleID= mother.visibleID;
                childObj.motherName = mother.name;
                childObj.fatherName = mother.husbandName;
                childObj.phone = mother.phone;
                childObj.house =mother.house;

                if(!childObj.childID){
                    //add new child
                    var childID = ChildService.addNewChild(childObj);
                    childObj.childID = childID;
                    //$scope.children[index].childID = childID;

                } else {
                    //this is an update to child
                    ChildService.updateChildDetails(childObj);
                }
                $scope.savedChildren.push(childObj);

            } else{

            }

        });
    };
// event handler for add more children
    $scope.addMoreChildren = function($event){
        // add more children if rows added are less than number of living children
        // var childRows = angular.element('.childDetails')
        var childObj={}
        $scope.children.push(childObj);
    };

    $scope.goToFP = function(){
        if(!$scope.woman.womanID){
            return false;
        }
        $location.path("/FP/"+ $scope.woman.visibleID);
    };

    $scope.goToANC = function(){
        if(!$scope.woman.womanID){
            return false;
        }
        $location.path("/ANC/"+ $scope.woman.visibleID);
    };

    $scope.validations = {
        validateSave: function(){
            var woman = $scope.woman
            if(!woman.house){
                return 'house no can not be blank!';
            }
            if(!woman.dob){
                return 'please provide a value for age or dob!'
            }
            return null;
        }
    }

}]);
