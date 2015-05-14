angular.module('uhiApp.controllers').controller('MapController', function($scope,$state,WomanService,ChildService,UtilityService) {

 //get pregnantwoman
  var womanList = WomanService.getWomanList();
    womanList.map(function(e) {
      var child = ChildService.getChildren(e.womanID);
      child = child.filter(function(e){         //remove children that are under "miscarriage" category
        return e.gender != 'misscarriage'
      })
     /* child.map(function(e){                          //children for 1 woman
       e.childAge = UtilityService.calcAge(e.dob)
      // e.childAction = ChildService.getImmunizationCategory(e.childId)
      })*/
      if(e.isPregnant === true){
       e.womanAction = WomanService.getWomanANCDetails(e.displayID)         //action for preg woman
       if(child.length == 0){                     //calculate image categ based on woman status and no of children
        e.imgCategory = 0;
       }else if(child.length == 1){
        e.imgCategory = 1;
       }else if(child.length == 2){
        e.imgCategory = 2;
       }else if(child.length > 2){
        e.imgCategory = 3;
       }
      }else{
       // e.womanAction = WomanService.getFPCategory(e.womanID)         //action for not preg woman
       if(child.length == 0){
        e.imgCategory = 4;
       }else if(child.length == 1){
        e.imgCategory = 5;
       }else if(child.length == 2){
        e.imgCategory = 6;
       }else if(child.length > 2){
        e.imgCategory = 7;
       }
      }
    });

  //}
  console.log(womanList)

});
