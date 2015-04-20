angular.module('starter.services')
.factory('UtilityService',['$cordovaFile', '$cordovaCamera', function($cordovaFile, $cordovaCamera){
  var cityCode="500", slumCode="200", workerCode="100";
 var dataDir, folder="images";  
  return {
    alertMessages: {
      liveBirth: 'Live births can not be greater than total pregnencies',
      livingChildren: 'Living Children can not be greater than number of children birth alive'
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
        var currDate =new Date(),
        diffYear = currDate.getFullYear() - dob.getFullYear(),
        diffMonth = currDate.getMonth() - dob.getMonth();
        if(inYear){
          // age is calculated in years 
          return diffYear;
        } else{
          //age is Calculated in months
          return 12 * diffYear + diffMonth;       

        }       
    
    },
    calcDob : function(age,inYear){
      var currDate= new Date(),
      currYear=currDate.getFullYear(),
      currMonth =currDate.getMonth() ;      
      if(inYear){
        //return new Date("Jan,15,"+currYear - age);
        return new Date(currYear-age +"-01-15");//
      } else {
        //age value is in months
        var year = parseInt(age/12), month=age%12, monthDiff = currMonth - month;
        if(monthDiff>0){
          return new Date(currYear - year+"-"+monthDiff+"-15");
        } else{
          return new Date(currYear - year - 1+"-"+(12+monthDiff)+"-15");
        }
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
        showMonthFromDate:function(date){
            var dateArray = date.split("/");
            return dateArray[1];
        },
        convertDateFormat:function(date){
            var day=date.getDate();
            var month=date.getMonth()+1;
            var year=date.getFullYear();
            return day+"/"+month+"/"+year;
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
      alert("this is browser, set a default Image");
      return;
     }
     
    },
    saveImage : function(imageData, fileName){ 
    // alert("inside utility service");
    try {
         dataDir = cordova.file.externalDataDirectory;
       //alert("ext dir: "+dataDir);
      
     
     if(!dataDir){
      console.log('image will be saved only on device');
      return;
     }
     function fail(err){
      alert("file error: "+err.message);
     }
     function onCopySuccess(){
      alert('image file saved');
     }
     function copyFile(fileEntry){
      var newName = fileName+".jpg";
      window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+folder, function(fileSystem2) {
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
      // copy file 
     // alert("Directory is present ");
      window.resolveLocalFileSystemURL(imageData, copyFile, fail);       
      };
     
     $cordovaFile.checkDir(dataDir, folder).then(onSuccessDir, function(err){
      //alert("No directory found, create new directory:"+ err.message);
       $cordovaFile.createDir(dataDir, folder).then(onSuccessDir, function(err){
        alert('Error in creating directory: '+err.message);
       });
      
     });
    } catch(e){
     
    }
  
    
    }
  }
}]);
