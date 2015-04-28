angular.module('uhiApp.controllers')
.controller('HomeController', function($scope, $state, UtilityService, WomanService, ChildService) {

    //code for tap on enter button
    $scope.mapWomen = function(){
        $state.go("mapWomen");
    };

    $scope.listWomen = function(){
        $state.go("listWomen");
    };

    $scope.reportWomen = function(){
        $state.go("reportWomen");
    };

    $scope.showFilmsPregnant = function(){
        $state.go("filmWomen");
    };

    $scope.showFilmsFP = function(){
        $state.go("filmWomen");
    };

    $scope.mapBabies = function(){
        $state.go("mapChildren");
    };

    $scope.listBabies = function(){
        $state.go("listChildren");
    };

    $scope.reportBabies = function(){
        $state.go("reportChildren");
    };

    $scope.showFilmsBabies = function(){
        $state.go("filmChildren");
    };

    $scope.goTo= function(){
        if(!$scope.houseNo){
            alert('Please put a house no. to go to woman or child page');
        } else{
            if($scope.womanNo) {
                if($scope.childNo){ // go to child page
                var childDisplayID = $scope.houseNo+"."+$scope.womanNo+"."+$scope.childNo;
                  if(!ChildService.isChildRegistered(childDisplayID)) {
                    alert('There is no child with this ID, Please check this ID');
                    return;
                  }
                  UtilityService.setChildDisplayID(childDisplayID);
                  //check if this child is new born 
                  ChildService.isNewBorn(childDisplayID) ? $state.go('newborn') : $state.go('immu');                  
                    
                } else { //go to woman page
                  var womanDisplayID = $scope.houseNo+"."+$scope.womanNo;
                  if(!WomanService.isWomanRegistered(womanDisplayID)){
                    alert('This woman is not registerd, please check this ID');
                    return;
                  }
                  UtilityService.setWomanDisplayID(womanDisplayID)
                    $state.go('add');
                }
            } else {
                alert('Please put a woman no. to go to woman or child page');
            }
        }
    }
});
