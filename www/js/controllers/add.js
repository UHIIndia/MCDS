angular.module('uhiApp.controllers').controller('AddController',function ($scope, $state, $stateParams, WomanService, ChildService, UtilityService, $cordovaCamera){

    var imgData;  var displayID = UtilityService.getWomanDisplayID();
if(displayID){
  $scope.woman = WomanService.getWomanDetails(displayID);
  //get children for this woman
 if($scope.woman){
  // update age for woman
  $scope.womanAge= (function(){
   if($scope.woman.dob){
    return UtilityService.calcAge($scope.woman.dob, true);
   } 
  }());
  //load Image from Imgaes Folder
  var imgURI = UtilityService.loadImage($scope.woman.womanID);
  imgURI ? $scope.imgURI =imgURI : $scope.imgURI ="img/woman-sample-profile-picture.png";
   var children = ChildService.getChildren($scope.woman.womanID);
   if(children.length){
     $scope.children = children;
     angular.forEach($scope.children, function(childObj, index){   
      var totalDays = UtilityService.calcAge(childObj.dob, false);
      childObj.ageMonths = parseInt(totalDays /30);
      childObj.ageDays = totalDays%30;     
     });
     $scope.savedChildren =angular.copy($scope.children);
     sortChildren();
   } else {
     $scope.children = [{}];
     addWatch($scope.children[$scope.children.length -1]);
     //
   }    
   
  
 } else {
  alert("Woman Not in list, Navigating back to home page");
  $state.go("home");
 }
} else{
  $scope.woman ={};
  $scope.woman.isPregnant = null // default not pregnant
  $scope.children=[{}];
  $scope.savedChildren =[];
  addWatch($scope.children[$scope.children.length -1], $scope.children.length -1);
  //$scope.woman.dob = getInitialDate();
}
$scope.alerts={
  age: {type: 'danger', msg: "Age should be between 11 and 99"},
  house:{type: 'danger', msg: "House no. can not be blank"}
}

$scope.isDisabled = function(index) {
  if($scope.children[index].displayID)return true;
  return false;
}
$scope.isWomanPregnant = function(){
  if($scope.woman.womanID && $scope.woman.isPregnant === true){
    return true;
  }
  if($scope.woman.womanID && $scope.woman.isPregnant === false){
    return false;
  }
  
}
// add watch for woman dob to set age
$scope.$watch('woman.dob', function(){
  $scope.setAge(true);
});
//add watch for child dob to set child age
  function addWatch(child, index) {
    $scope.$watch(function(scope){
    $scope.child = child;
    return $scope.child.dob;
    }, function(){
    $scope.setAge(false, index);
    })
  }
/*angular.forEach($scope.children, function(child, index){
  $scope.$watch(function(scope){
    $scope.child = child;
    return $scope.child.dob;
  }, function(){
    $scope.setAge(false, index);
  })
});*/
// setting age based on dob
$scope.setAge = function(inYear, index){
  var dob;
  if(inYear){
    dob = $scope.woman.dob;
    if(dob) $scope.womanAge = UtilityService.calcAge(dob, inYear);
  } else {
    var child = $scope.children[index];
    dob = child.dob;
    if(dob) {
      var totalDays = UtilityService.calcAge(dob, inYear);
      child.ageMonths = parseInt(totalDays /30);
      child.ageDays = totalDays%30;
    }
  }
  
}; 

//setting dob based on age 
$scope.setDob = function(inYear, index){
  var age, date, mm, dateStr;      
    if(inYear){
      //this is for woman
      age= $scope.womanAge;
      if(age){  
        date = UtilityService.calcDob(inYear, age);
         mm = date.getMonth()+1;
         if(mm < 10)  mm = "0"+mm;
         dateStr =date.getDate()+"/"+mm+"/"+date.getFullYear();
         $scope.woman.dob =  dateStr;
      }
    } else{
      //this is for child
     var child = $scope.children[index];
     //ageMonths = child.ageMonths, ageDays = child.ageDays;
      if(!child.ageDays && !child.ageMonths){
        // no value or both has 0 
        child.dob =null;
        return;
      }
      if(child.ageMonths && !child.ageDays){        
          child.ageDays = 0;       
      } else if(child.ageDays && !child.ageMonths){
        child.ageMonths = 0;
      } 
      if(child.ageDays >=30){
        child.ageMonths += parseInt(child.ageDays/30);
        child.ageDays = child.ageDays%30;
      }
      var months = child.ageMonths, days= child.ageDays;
       date = UtilityService.calcDob(inYear, months, days);
       mm = date.getMonth()+1;
       if(mm < 10)  mm = "0"+mm;
       dateStr =date.getDate()+"/"+mm+"/"+date.getFullYear();
       child.dob = dateStr;
     
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
     alert(err);
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
  UtilityService.saveImage(imgData, $scope.woman.womanID).then(function(success){
    imgData = null;
    alert(success);    
  }, function(err){
    alert("Image not saved "+ err);
  });
 }  
  //display saved children
  //$scope.savedChildren=angular.copy($scope.children);
 $scope.savedChildren = [];
  //iterarte each children to save 
  for (var i=0; i<$scope.children.length; i++){
    var childObjInView = $scope.children[i];
    var childObj = angular.copy(childObjInView);
    //delete keys which are not required in data
    delete childObj.ageDays;
    delete childObj.ageMonths;    
    if(childObj.name || childObj.dob || childObj.sex) {
      if(!childObj.dob){
        alert("Please enter dob for child no. : "+(i+1));
        continue;
      }
      if(!childObj.sex){
        alert("Please select sex for child no. : "+(i+1));
        continue;
      }
      var mother= $scope.woman;      
        childObj.motherID = mother.womanID;
        childObj.motherDisplayID= mother.displayID;
        childObj.motherName = mother.name;
        childObj.fatherName = mother.husbandName;        
        childObj.house =mother.house;

    if(!childObj.displayID){    
       //add new child
      var displayID = ChildService.addNewChild(childObj);
      childObj.displayID = displayID;
      childObjInView.displayID = displayID;      
    } else {
      //this is an update to child
      ChildService.updateChildDetails(childObj);
    }
      childObj.ageDays = childObjInView.ageDays;
      childObj.ageMonths = childObjInView.ageMonths;
    $scope.savedChildren.push(angular.copy(childObj));     
      
    }
  }  
  // sort saved children on age youngest to oldest
 sortChildren();
 // update child related data (livingChildren and dob of youngest child)
  if($scope.savedChildren.length){
    $scope.woman.livingChildrenCount = $scope.savedChildren.length;    
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
  addWatch($scope.children[$scope.children.length -1], $scope.children.length -1);
  $scope.isOpenPosition[$scope.children.length-1] = false;
};
  /* calender related methods*/
$scope.dateFormat = "dd/MM/yyyy";
 function getInitialDate() {
  var currDate =new Date(),
     day= currDate.getDate(),
     month = currDate.getMonth()+1,
     year= currDate.getFullYear(); 
  // woman should not be less than 11 years old
  return year-11+"-"+month+"-"+day;
 
};
$scope.getMaxDate = function(isWoman) {
 var currDate =new Date(),
     day= currDate.getDate(),
     month = currDate.getMonth()+1,
     year= currDate.getFullYear();
 if(isWoman){
  // woman should not be less than 11 years old  
  return year-11+"-"+month+"-"+day;
   
 } else {
  // should not select a future date than current date
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
/* calender methods ends here--  */
$scope.getChildIcon = function(child){
  if(child.sex === 'M'){
    return 'icon-boy';
  } else if(child.sex === 'F'){
    return "icon-girl";
  }
}
$scope.selectedGenderForChild = function(child, isGirl) {
  if(child.sex === 'F' && isGirl){
    return "";
  } else if(child.sex === 'M' && !isGirl){
    return "";
  } 
  return "inactive";
}
$scope.navigateToChild = function($index) {
  var child = $scope.savedChildren[$index];
  var childDisplayID = child.displayID;
  if(child.ageMonths > 36){
    alert('This child id more than 2 years old, please select a child less than 2 years old');
    return;
  } else {
    UtilityService.setChildDisplayID(childDisplayID).then(function(success){
      console.info(success);
      var days = UtilityService.calcAge(child.dob, false);
        if(days<=42){     
          $state.go('newborn');
        } else {
          $state.go('immunisation');
        }  
    }, function(err){});
      
  }  
}
$scope.navigateToWoman = function() {
  //set woman DisplayID 
  var woman = $scope.woman;
  if(!woman.displayID){
    // no woman has been added yet
    return;
  }
  UtilityService.setWomanDisplayID(woman.displayID).then(function(success){
    console.log(success);
    if(woman.isPregnant === true){
      $state.go('anc');
    } else {
      $state.go('fp');
    }
  }, function(err){console.log('some error in setting woman display id')});
  
}
$scope.validations = {
 validateSave: function(){
  var woman = $scope.woman; var childList =$scope.children;
  if(!woman.house){
   return 'House no. can not be blank!';
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
function sortChildren() {
  // sort saved children on age youngest to oldest
  $scope.savedChildren.sort(function(childA, childB){
    /*var daysA = childA.ageMonths * 30 + childA.ageDays;
    var daysB = childB.ageMonths * 30 + childB.ageDays;
    return daysA - daysB;*/
    var childADob = new Date(childA.dob);
    var childBDob = new Date(childB.dob);
    return childBDob - childADob;
  });
}  

});
