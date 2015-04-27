angular.module('uhiApp.controllers')
.controller('HomeController', function($scope, $state, UtilityService, WomanService, ChildService) {

    //code for tap on enter button
    $scope.mapWomen = function(){
        $location.path("/map-women");
    };

    $scope.listWomen = function(){
        $location.path("/list-women");
    };

    $scope.reportWomen = function(){
        $location.path("/report-women");
    };

    $scope.showFilmsPregnant = function(){
        $location.path("/film-women");
    };

    $scope.showFilmsFP = function(){
        $location.path("/film-women");
    };

    $scope.mapBabies = function(){
        $location.path("/map-children");
    };

    $scope.listBabies = function(){
        $location.path("/list-children");
    };

    $scope.reportBabies = function(){
        $location.path("/report-children");
    };

    $scope.showFilmsBabies = function(){
        $location.path("/film-children");
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
