angular.module('uhiApp.controllers')
.controller('AddController', ['$scope','$location','$stateParams','WomanService','ChildService','UtilityService','$cordovaCamera',function ($scope, $location, $stateParams, WomanService, ChildService, UtilityService, $cordovaCamera){
 var imgData;
if($stateParams.id){
  $scope.woman = WomanService.getWomanDetails($stateParams.id);
  //get children for this woman
 if($scope.woman){
  // update age for woman
  $scope.woman.age = (function(){
   if($scope.woman.dob){
    $scope.woman.dob = new Date($scope.woman.dob);
    return UtilityService.calcAge($scope.woman.dob, true);
   } 
  }());
  //load Image from Imgaes Folder
  var imgURI = UtilityService.loadImage($scope.woman.womanID);
  imgURI ? $scope.imgURI =imgURI : $scope.imgURI ="img/ionic.png";
  
  $scope.children = ChildService.getChildren($scope.woman.womanID);
  angular.forEach($scope.children, function(childObj, index){
   childObj.dob = new Date(childObj.dob);
   childObj.age = UtilityService.calcAge(childObj.dob, false);
  });
 } else {
  alert("Woman Not in list, Navigating back to home page");
  $location.path("/home");
 }
} else{
  $scope.woman ={};
  $scope.woman.isPregnant = 'false' // default not pregnant
  $scope.children=[{}];
  $scope.savedChildren =[];  
}
 
$scope.isWomanPregnant = function(){
  if($scope.woman && $scope.woman.isPregnant === 'true'){
    return true;
  }
  return false;
}

// setting age based on dob
$scope.setAge = function(inYear, index){
  var dob;
  if(inYear){
    dob = $scope.woman.dob;
    if(dob) $scope.woman.age = UtilityService.calcAge(dob, inYear);
  } else {
    var child = $scope.children[index];
    dob = child.dob;
    if(dob) child.age = UtilityService.calcAge(dob, inYear);
  }
  
};

//setting dob based on age 
$scope.setDob = function(inYear, index){
  var age, date, mm, dateStr;      
    if(inYear){
      //this is for woman
      age= $scope.woman.age;
      if(age){  
        date = UtilityService.calcDob(age, inYear);
         mm = date.getMonth()+1;
         if(mm < 10)  mm = "0"+mm;
         dateStr =date.getDate()+"/"+mm+"/"+date.getFullYear();
         $scope.woman.dob =  dateStr;
      }
    } else{
      //this is for child
     var child = $scope.children[index];
     age = child.age;
     if(age) {
       date = UtilityService.calcDob(age, inYear);
       mm = date.getMonth()+1;
       if(mm < 10)  mm = "0"+mm;
       dateStr =date.getDate()+"/"+mm+"/"+date.getFullYear();
       child.dob = dateStr;
     }
    }  
}
//function for setting Expected delivery date based on LMP
$scope.setEDD = function(){
  if($scope.woman.currentPreg){
    var LMPDate = $scope.woman.currentPreg.LMP,
    isEligibleForEDD,
    currDate = new Date(),
    ineligibleDate;  //an edd is set only if lmp is 45 days before the current date

   if(LMPDate){
    ineligibleDate = UtilityService.addDaysToDate(LMPDate, 44);
    // if current date is equal to or greater than in eligible date then set edd after 40 weeks of LMP date
    isEligibleForEDD = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()).getTime() - ineligibleDate.getTime() >= 0;
    if(isEligibleForEDD){
      $scope.woman.currentPreg.EDD = UtilityService.addDaysToDate(LMPDate, 279);
    } else{
      $scope.woman.currentPreg.EDD ="";
    }

   }
  }
 
};

$scope.setLMP = function(){
  if($scope.woman.currentPreg){
    var EDDDate = $scope.woman.currentPreg.EDD,
    //isEligibleForEDD,
    currDate = new Date();  //an edd is set only if lmp is 45 days before the current date

   if(EDDDate){
    $scope.woman.currentPreg.LMP = UtilityService.subtractDaysFromDate(EDDDate, 279);

   }
  }
}
// function for capturing image from cam
$scope.captureImage = function($event){
  /* UtilityService.captureImage().then(function(imgData){
    alert("Image: "+imgData);
     if(imgData)
      $scope.imgURI = "data:image/jpeg;base64," + imgData;
     else {
      //show a default image
     }}, function(err){
    alert("Error in Capturing Image:" + err);
   });*/
 document.addEventListener("deviceready", function () {
    var options = {
      quality: 50,
      //destinationType: Camera.DestinationType.DATA_URL, // returns base 64 encoded string
     destinationType: Camera.DestinationType.FILE_URI, // returns Img uri in local storage
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(/*imageData*/imgURI) {      
     imgData= imgURI;  
    //  $scope.imgURI = "data:image/jpeg;base64," + imgData;
      $scope.imgURI = imgData;
    }, function(err) {
      // error
     alert("ERROR IN CAMERA CAPTURE: "+err);
     return;
    });

    }, false);
 
};

// method for saving all the details
$scope.saveDetails = function($event){
 var errorMsg = $scope.validations.validateSave();
  if(errorMsg){
   alert(errorMsg);
   return;
  }
 
  if(!$scope.woman.womanID){
    //add new woman and new children in woman liat and child list
    $scope.woman.womanID = WomanService.addNewWoman($scope.woman);  
  } else {
    // this is an update
    WomanService.updateWomanDetails($scope.woman);
  }
  // change image if image has been changed
 if(imgData){  
  UtilityService.saveImage(imgData, $scope.woman.womanID);
 }
  // sort saved children on age youngest to oldest
  $scope.children.sort(function(childA, childB){
    return childA.age - childB.age;
  });
  //display saved children
  //$scope.savedChildren=angular.copy($scope.children);
 $scope.savedChildren = [];
  angular.forEach( $scope.children, function(childObj, index){   
    if(childObj.name){
      var mother= $scope.woman;      
        childObj.motherID = mother.womanID;
        childObj.mothersVisibleID= mother.visibleID;
        childObj.motherName = mother.name;
        childObj.fatherName = mother.husbandName;
        childObj.phone = mother.phone;
        childObj.house =mother.house;

    if(!childObj.childID){    
       //add new child
      var childID = ChildService.addNewChild(childObj);
      childObj.childID = childID;
      //$scope.children[index].childID = childID;

    } else {
      //this is an update to child
      ChildService.updateChildDetails(childObj);
    }
    $scope.savedChildren.push(childObj);   
     
    } else{
      // no name of child 
    } 
    
  });
 // update child related data (livingChildren and dob of youngest child)
  if($scope.savedChildren.length){
    $scope.woman.livingChildren = $scope.savedChildren.length;
    $scope.woman.youngestChildDob = $scope.savedChildren[0].dob; // array is already sorted from youngest to oldest
    WomanService.updateWomanDetails($scope.woman);
  }
      
 //alert('saved successfully');
};
// event handler for add more children 
$scope.addMoreChildren = function($event){
  // add more children if rows added are less than number of living children
 // var childRows = angular.element('.childDetails')
  var childObj={}
  $scope.children.push(childObj);
  $scope.isOpenPosition[$scope.children.length-1] = false;
};
// navigate to family planning page
$scope.goToFP = function(){
  if(!$scope.woman.womanID){
    return false;
  }
  $location.path("/FP/"+ $scope.woman.visibleID);
};
// navigate to ANC page
$scope.goToANC = function(){
  if(!$scope.woman.womanID){
    return false;
  }
  $location.path("/ANC/"+ $scope.woman.visibleID);
};
$scope.dateFormat = "dd/MM/yyyy";
$scope.getMaxDate = function(isWoman) {
 var currDate =new Date(),
     day= currDate.getDate(),
     month = currDate.getMonth()+1,
     year= currDate.getFullYear();
 if(isWoman){
  // woman should not be less than 11 years old
  return year-11+"-"+month+"-"+day;
 } else {
  // should not select a future date than currebt date
  return year +"-"+month+"-"+day;
 }
};
$scope.isWomanDobCalenderOpen = false;
$scope.isOpenPosition = {"0": false};
  
$scope.openCalender = function($event, isWoman, $index) {
 $event.preventDefault();
 $event.stopPropagation();
  if(isWoman) {
   //open woman calender
    $scope.isWomanDobCalenderOpen=true;
  } else {
    $scope.isOpenPosition[$index] = true;
  }
 }
$scope.getChildIcon = function(child){
  if(child.sex === 'M'){
    return 'icon-boy';
  } else {
    return "icon-girl";
  }
}
$scope.validations = {
 validateSave: function(){
  var woman = $scope.woman; var childList =$scope.children;
  if(!woman.house){
   return 'house no can not be blank!';
  }
  if(woman.name && woman.name.length ==1){
   return 'Please provide atleast 2 characters in name';
  }
  if(!woman.dob){
   return 'please provide a value for age or dob.';
  }
  angular.forEach(childList, function(child, index){
   if(child.name){
    if(child.name.length == 1){
    return 'please provide at least 2 characters in name for child no. '+ index+1;
    }
    if(!child.dob){
    return 'please provide a value for age or dob for child no. ' + index+1;
    }
    if(!child.sex){
    return 'Please select gender for child no. '+index+1; 
    }
   }
   
  });
  return null;
 }   
}
  

}]);
