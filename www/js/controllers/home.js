angular.module('starter.controllers')
.controller('HomeController', ['$scope','UtilityService','$location',function($scope, UtilityService,$location) {

    //code for tap on enter button
    $scope.mapWomen = function(){
        $location.path("/mapWoman");
    }

    $scope.listWomen = function(){
        $location.path("/listWoman");
    }

    $scope.reportWomen = function(){
        $location.path("/reportWoman");
    }

    $scope.showFilmsPregnant = function(){
        $location.path("/filmsWoman");
    }

    $scope.showFilmsFP = function(){
        $location.path("/filmsWoman");
    }

    $scope.mapBabies = function(){
        $location.path("/mapChild");
    }

    $scope.listBabies = function(){
        $location.path("/listChild");
    }

    $scope.reportBabies = function(){
        $location.path("/reportChild");
    }

    $scope.showFilmsBabies = function(){
        $location.path("/filmsChild");
    }

    $scope.goTo= function(){
        if(!$scope.houseNo){
            alert('Please put a house no. to go to woman or child page');
        } else{
            if($scope.womanNo) {
                if($scope.childNo){ // go to child page
                    $location.path('/child/'+$scope.houseNo+"."+$scope.womanNo+"."+$scope.childNo);
                } else { //go to woman page
                    $location.path('/addWoman/'+$scope.houseNo+"."+$scope.womanNo);
                }
            } else {
                alert('Please put a woman no. to go to woman or child page')
            }
        }
    }
}]);
