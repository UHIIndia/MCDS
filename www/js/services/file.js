angular.module('uhiApp.services')
.factory('FileService', function(){
  var jsonFilePath="";  
  var localStorageKey = 'UHI_MCAS';
  function initStorage(){
    // this is temprory
    console.log('No data has been imported to system, Initializing manually for now');
       var obj = { 
        womanArray :[],
        childArray :[]
       }
       localStorage[localStorageKey] =JSON.stringify(obj);     
  }
 //initStorage();
  if(localStorage && !localStorage[localStorageKey]){
    initStorage();
  }
  
  return {
    readFromLocalStorage: function(isWoman){
      var lsData=localStorage[localStorageKey]; // this will Json file data      
      var jsonObj = JSON.parse(lsData);
      if(isWoman){
        return jsonObj.womanArray ? jsonObj.womanArray: [];
      }else{
        //get children list
        return jsonObj.childArray ? jsonObj.childArray : [];
      }
      //read file from json file path and return women list
    },
    writeToLocalStorage: function(list, isWoman){
      var lsData=localStorage[localStorageKey]; // this will Json file data
      if(lsData === undefined){
       // alert('No data has been imported to system');
        return;       
      }
      var jsonObj = JSON.parse(lsData);
      if(isWoman){
        //write women List to json file 
        jsonObj.womanArray = list;
      } else {
        //write child List to json file 
        jsonObj.childArray = list;
      }
      
      localStorage[localStorageKey] = JSON.stringify(jsonObj);
    },
    importToLocalStorage : function  (argument) {
      // get data from a json file to local storage
      //hard coding for now : kamlesh 9th april.. need to be changed later
    },
    exportToFile : function (argument) {
      // write data from local storage to file
    }
  }
});
