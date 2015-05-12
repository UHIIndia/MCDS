angular.module('uhiApp.controllers')
  .controller('LoginController', function($scope, $state) {

  $scope.login = {};
  var code = 123;

  //code for tap on enter button
  $scope.enterHome = function(){
    if(code === $scope.login.workerCode){
      $scope.required = false;
      $scope.incorrect = false;
      $scope.login.workerCode = null;
      $state.go('home');
    }else if( $scope.login.workerCode === null ||  $scope.login.workerCode == undefined){
      $scope.required = true;
      $scope.incorrect = false;
    }else{
      $scope.incorrect = true;
      $scope.required = false;
    }
  };

});
