angular.module('uhiApp.controllers')
.controller('LoginController', function($scope, $location) {

    //code for tap on enter button
    $scope.enterHome = function(){
        var code = 123;
        if(code == $scope.workerCode){
            $scope.required = false;
            $scope.incorrect = false;
            $scope.workerCode ="";
            $location.path("home");
        }else if( $scope.workerCode == "" ||  $scope.workerCode == undefined){
            $scope.required = true;
            $scope.incorrect = false;
        }else{
            $scope.incorrect = true;
            $scope.required = false;
        }
    }

});
