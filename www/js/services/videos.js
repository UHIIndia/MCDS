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

   var ancVideos = [
    {
      'id': 1,
      'filename': 'asha.mp4',
      'title': 'ASHA AWWW VISIT'
    },
    {
      'id': 2,
      'filename': 'anm.mp4',
      'title': 'ANM. DOC. CHECKUP'
    },
    {
      'id': 3,
      'filename': 'weight.mp4',
      'title': 'Weight'
    },
    {
      'id': 4,
      'filename': 'tt.mp4',
      'title': 'TT'
    },
    {
      'id': 5,
      'filename': 'anaemia.mp4',
      'title': 'Anaemia'
    },
    {
      'id': 6,
      'filename': 'paleness.mp4',
      'title': 'Paleness'
    },
    {
      'id': 7,
      'filename': 'nightblind.mp4',
      'title': 'Night Blind'
    },
    {
      'id': 8,
      'filename': 'bleeding.mp4',
      'title': 'Bleeding'
    },
    {
      'id': 9,
      'filename': 'malaria.mp4',
      'title': 'Malaria'
    },
    {
      'id': 10,
      'filename': 'ifaTablets.mp4',
      'title': 'IFA Tablets'
    },
    {
      'id': 11,
      'filename': 'bp.mp4',
      'title': 'BP'
    },
    {
      'id': 12,
      'filename': 'urineprotein.mp4',
      'title': 'Urine Protein'
    },
    {
      'id': 13,
      'filename': 'swelling.mp4',
      'title': 'Swelling'
    },
    {
      'id': 14,
      'filename': 'fits.mp4',
      'title': 'Fits/blurred vision/headache'
    },
    {
      'id': 15,
      'filename': 'urinesugar.mp4',
      'title': 'Urine Sugar'
    },
    {
      'id': 16,
      'filename': 'fever.mp4',
      'title': 'Fever'
    },
    {
      'id': 17,
      'filename': 'foulsmell.mp4',
      'title': 'Foul smelling Discharge'
    },
    {
      'id': 18,
      'filename': 'weakness.mp4',
      'title': 'Weakness/other illness'
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

  var getANCVideos = function() {
    var list;
    ancVideos.map(function(e) {
      if(isDevice) {
        e.path =  baseVideosPath + e.filename;
      } else {
        e.path = 'videos/sample.mp4'
      }
    });
    return ancVideos;
  };

  return {
    getFamilyPlanningVideos: getFamilyPlanningVideos,
    getANCVideos : getANCVideos
  }
});
