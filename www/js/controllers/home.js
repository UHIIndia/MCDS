angular.module('uhiApp.controllers')
.controller('HomeController', ['$scope','UtilityService','$location',function($scope, UtilityService,$location) {

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
                    $location.path('/child/'+$scope.houseNo+"."+$scope.womanNo+"."+$scope.childNo);
                } else { //go to woman page
                    $location.path('/add/'+$scope.houseNo+"."+$scope.womanNo);
                }
            } else {
                alert('Please put a woman no. to go to woman or child page');
            }
        }
    }
}]);
