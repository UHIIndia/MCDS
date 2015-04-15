angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('TranslateCtrl', function($translate, $scope){
	$scope.changeLanguage = function(langKey) {
		$translate.use(langKey);
	};
})
.controller('HomeController', function($scope, $location) {

  //code for tap on enter button
  $scope.mapWomen = function(){
     alert("mapWomen");
  }

  $scope.listWomen = function(){
      $location.path("/listWomen");
  }

  $scope.reportWomen = function(){
      alert("reportWomen");
  }

  $scope.showFilmsPregnant = function(){
      alert("showFilmsPregnant");
  }

  $scope.showFilmsFP = function(){
      alert("showFilmsFP");
  }

  $scope.mapBabies = function(){
      alert("mapBabies");
  }

  $scope.listBabies = function(){
      alert("listBabies");
  }

  $scope.reportBabies = function(){
      alert("reportBabies");
  }

  $scope.showFilmsBabies = function(){
      alert("showFilmsBabies");
  }

})

.controller('LoginController', function($scope, $location) {

  //code for tap on enter button
  $scope.enterHome = function(){
    var code = 123;
    if(code == $scope.workerCode){
      $scope.required = false; 
      $scope.incorrect = false; 
      $scope.workerCode ="";
      //$window.location.href = '/home';
      $location.path("/home");
    }else if( $scope.workerCode == "" ||  $scope.workerCode == undefined){
      $scope.required = true; 
      $scope.incorrect = false; 
    }else{
      $scope.incorrect = true; 
      $scope.required = false; 
    } 
  }

});
