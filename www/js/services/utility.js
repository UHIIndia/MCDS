angular.module('uhiApp.services')
.factory('UtilityService', function($cordovaFile, $cordovaCamera, $q){
  var cityCode="500", slumCode="200", workerCode="100";
  var dataDir, folder="images"; 
  var womanDisplayID, childDisplayID;
  return {
    alertMessages: {
      liveBirth: 'Live births can not be greater than total pregnencies',
      livingChildren: 'Living Children can not be greater than number of children birth alive'
    },
    setWomanDisplayID: function (id) {
      womanDisplayID = id;
    },
    getWomanDisplayID : function() {
      return womanDisplayID;
    },
    setChildDisplayID: function (id) {
      childDisplayID = id;
    },
    getChildDisplayID : function() {
      return childDisplayID;
    },
    getSlumCode: function(){
      return slumCode;
    },
    getCityCode: function(){
      return cityCode;
    },
    getWorkerCode: function(){
     return workerCode;
    },
    calcAge: function(dob, inYear){
      if(!angular.isDate(dob)){
        //its a dd/mm/yyyy string 
        var arr = dob.split('/');
        var mmddyyyyStr = arr[1]+"/"+arr[0]+"/"+arr[2];
        dob = new Date(mmddyyyyStr);
      }
        var currDate =new Date(),
        diffYear = currDate.getFullYear() - dob.getFullYear(),
        diffMonth = currDate.getMonth() - dob.getMonth(),
        diffDays = currDate.getDate() - dob.getDate();
        if(inYear){
          // age is calculated in years return years
          return diffYear;
        } else{
          //age is Calculated in months and days, return days  
          return 30*(12 * diffYear + diffMonth)+diffDays+1;   

        }       
    
    },
    /*function for calc dob based on age,
    * params: inYear - true age in year, false age in months and Days
    * returns a Date
    */
    calcDob : function(inYear, age, days){
      var currDate= new Date(),
      currYear=currDate.getFullYear(),
      currMonth =currDate.getMonth() ;
      age = parseInt(age);
      if(inYear){
        //return new Date("Jan,15,"+currYear - age);
        return new Date(currYear-age +"-01-15");//
      } else {       
        days= parseInt(days);
        days = age * 30 + days -1;
        return this.subtractDaysFromDate(currDate, days);
      }
            
    },
    addDaysToDate : function(dateObj, days){
      var dat = new Date(dateObj.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }, 
    subtractDaysFromDate : function(dateObj, days){
      var dat = new Date(dateObj.valueOf());
      dat.setDate(dat.getDate() - days);
      return dat;
    },
    isSameDate : function(date1, date2){
      //only  checking day month and year
      return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate());
    },
    generateWomanID: function(houseCode, womanNo){
      return cityCode+slumCode+workerCode+houseCode+womanNo;
    },   
    showMonthFromDate:function(date){console.log("showMonFromDate")
        var dateArray = date.split("/");
        return dateArray[1];
    },
     convertToDate:function(date){console.log("showMonFromDate")
        var dateArray = date.split("/");
        var year=dateArray[2];
        var month=dateArray[1] ;
        var day=dateArray[0]
        var date =new date(year,month,day)
        return date;
    },
    convertDateFormat:function(date){
        var day=date.getDate();
        var month=date.getMonth()+1;
        var year=date.getFullYear();
        return day+"/"+month+"/"+year;
    },
    setMaxMinDate:function(date){
    var day=date.getDate();
    var month=date.getMonth()+1;
    var year=date.getFullYear();
    return year+"/"+month+"/"+day;
    },
    showMonth:function(monthNo){

        switch(monthNo) {
                case 1:
                case 01:
            return "Jan"
            break;
                case 2:
                case 02:
            return "Feb"
            break;
                case 3:
                case 03:
            return "Mar"
            break;
                case 4:
                case 04:
            return "Apr"
            break;
                case 5:
                case 05:
            return "May"
            break;
                case 6:
                case 06:
            return "Jun"
            break;
                case 7:
                case 07:
            return "Jul"
            break;
                case 8:
                case 08:
            return "Aug"
            break;   
                case 9:
                case 09:
            return "Sep"
            break;
                case 10:
            return "Oct"
            break;
                case 11:
            return "Nov"
            break;
                case 12:
            return "Dec"
            break;
        default:
            return "Jan"
      }
    },
    captureImage: function(){
     document.addEventListener("deviceready", function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    return $cordovaCamera.getPicture(options).then(function(imageData) { 
    // alert(imageData);
     return imageData;    
    }, function(err) {
      // error
     alert("ERROR IN CAMERA CAPTURE: "+err.msg);
     return;
    });

    }, false);
    },
    loadImage : function(fileName){
     //fileName is {id}.jpeg
     try{
       var imgURL = cordova.file.externalDataDirectory + folder+"/"+fileName+".jpg";
       return imgURL;
     } catch(e){
      //alert("this is browser, set a default Image");
      return;
     }
     
    },
    saveImage : function(imageData, fileName){ 
    // alert("inside utility service");
    var deferred = $q.defer();
      // call async    
    try {
         dataDir = cordova.file.externalDataDirectory;
       //alert("ext dir: "+dataDir);
      
     
     if(!dataDir){
      console.log('image will be saved only on device');
      return;
     }
     function fail(err){      
      //alert("Error Code: "+err.code);
       deferred.reject("Error Code: "+err.code)
     }
     function onCopySuccess(){
       deferred.resolve('image file saved');
     }
     function copyFile(fileEntry){
      var newName = fileName+".jpg";        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+folder, function(fileSystem2) {
      // alert('ext dir for copying :'+ fileSystem2);
       //kkj: use moveTo and then point to new saved image in extyernal directory
				fileEntry.moveTo(
					fileSystem2,
					newName,
					onCopySuccess,
					fail
				);
			},
			fail);
     }
     var onSuccessDir = function(success){
       window.resolveLocalFileSystemURL(imageData, copyFile, fail);       
      };
     
     $cordovaFile.checkDir(dataDir, folder).then(onSuccessDir, function(err){
      //alert("No directory found, create new directory:"+ err.message);
       $cordovaFile.createDir(dataDir, folder).then(onSuccessDir, function(err){
        //alert('Error in creating directory: '+err.code);
         deferred.reject('Error in creating directory: '+err.code);
       });
      
     });
    } catch(e){
     console.log('exception :' + e);
      deferred.reject('exception :' + e);
    }
      
    return deferred.promise;
  
    
    },
    convertToDate: function(date){
      if(!angular.isDate(date)){
        //its a dd/mm/yyyy string 
        var arr = date.split('/');
        var mmddyyyyStr = arr[1]+"/"+arr[0]+"/"+arr[2];
        date = new Date(mmddyyyyStr);
      }
      return date;
    }
  }
});
