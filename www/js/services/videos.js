angular.module('uhiApp.services').factory('videos',function($window){

  var baseVideosPath;
  var isDevice = false;

  // run only on device
  try{
    baseVideosPath = cordova.file.externalDataDirectory + 'videos/';
  }catch(e){
    baseVideosPath = "videos/";
    console.log(e);
  }

  if($window.cordova){
    isDevice = true;
  }

  var familyPlanningVideos = [
    {
      'id': 1,
      'filename': 'fst.mp4',
      'title': 'Female Sterilization'
    },
    {
      'id': 2,
      'filename': 'nsv.mp4',
      'title': 'Male Sterilization'
    },
    {
      'id': 3,
      'filename': 'iucd.mp4',
      'title': 'IUCD'
    },
    {
      'id': 4,
      'filename': 'dmpa.mp4',
      'title': 'DMPA'
    },
    {
      'id': 5,
      'filename': 'ocp.mp4',
      'title': 'OCP'
    },
    {
      'id': 6,
      'filename': 'condom.mp4',
      'title': 'Condom'
    },
    {
      'id': 7,
      'filename': 'ppfp.mp4',
      'title': 'Postpartum family planning'
    },
    {
      'id': 8,
      'filename': 'papf.mp4',
      'title': 'Post abortion family planning'
    }
  ];

  var getFamilyPlanningVideos = function() {
    var list;
    familyPlanningVideos.map(function(e) {
      if(isDevice) {
        e.path =  baseVideosPath + e.filename;
      } else {
        e.path = 'videos/sample.mp4'
      }
    });
    return familyPlanningVideos;
  };

  return {
    getFamilyPlanningVideos: getFamilyPlanningVideos
  }
});
