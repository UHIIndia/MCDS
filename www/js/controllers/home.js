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
        UtilityService.setVideoTab(3);
        $state.go("filmWomen");
    };

    $scope.showFilmsFP = function(){
        UtilityService.setVideoTab(2);
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
        UtilityService.setVideoTab(4);
        $state.go("filmWomen");
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
                  UtilityService.setChildDisplayID(childDisplayID).then(function(){
                      //check if this child is new born 
                  var isNewBorn = ChildService.isNewBorn(childDisplayID);
                  switch(isNewBorn){
                      case 1: 
                      $state.go('newborn');
                      break;
                      case 2: 
                      $state.go('immunisation');
                      break;
                      case 0:
                      alert('This child is older than 3 years');
                  }   
                  }, function(err){});
                                                
                    
                } else { //go to woman page
                  var womanDisplayID = $scope.houseNo+"."+$scope.womanNo;
                  if(!WomanService.isWomanRegistered(womanDisplayID)){
                    alert('This woman is not registerd, please check this ID');
                    return;
                  }
                  UtilityService.setWomanDisplayID(womanDisplayID).then(function(success){
    console.log(success);
    $state.go('add');
  }, function(err){console.log('some error in setting woman display id')});
                    
                }
            } else {
                alert('Please put a woman no. to go to woman or child page');
            }
        }
    };
    
    $scope.addWoman = function () {
      UtilityService.setWomanDisplayID(null).then(function(success){
        $state.go('add');
      }, function(err){});
      
    }
});
