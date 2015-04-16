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
}])
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

})

.controller('AddController', function($scope) {

})

.controller('AncController', function($scope) {

})

.controller('FpController', function($scope) {

})

.controller('MapWomenController', function($scope) {

})

.controller('MapChildrenController', function($scope) {

})

.controller('ListWomenController', function($scope) {

})

.controller('ListChildrenController', function($scope) {

})

.controller('ReportWomenController', function($scope) {

})

.controller('ReportChildrenController', function($scope) {

})

.controller('FilmController', function($scope) {

});
