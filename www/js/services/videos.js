angular.module('uhiApp.services').factory('videos',function($window){

  var baseVideosPath;
  var isDevice = false;

  if($window.cordova){
    baseVideosPath = cordova.file.externalDataDirectory + 'videos/';
    isDevice = true;
  } else {
    baseVideosPath = "videos/";
  }

  var familyPlanningVideos = [
    {
      'id': 1,
      'filename': 'fst.mp4',
      'title': 'Female Sterilization',
      'methodName':'Female Sterilization',
      'methodMsg':'(Kaise apnayen mahila nasbandi)'
    },
    {
      'id': 2,
      'filename': 'nsv.mp4',
      'title': 'Male Sterilization',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 3,
      'filename': 'iucd.mp4',
      'title': 'IUCD',
      'methodName':'IUCD',
      'methodMsg':'(kaise apnayen IUCD)'
    },
    {
      'id': 4,
      'filename': 'dmpa.mp4',
      'title': 'DMPA',
      'methodName':'DMPA',
      'methodMsg':'(kaise apnayen DMPA)'
    },
    {
      'id': 5,
      'filename': 'ocp.mp4',
      'title': 'OCP',
      'methodName':'OCP',
      'methodMsg':'(kaise apnayen OCP)'
    },
    {
      'id': 6,
      'filename': 'condom.mp4',
      'title': 'Condom',
      'methodName':'Condom',
      'methodMsg':'(kaise apnayen condom)'
    },
    {
      'id': 7,
      'filename': 'ppfp.mp4',
      'title': 'Postpartum family planning',
      'methodName':'Postpartum family planning',
      'methodMsg':'(kaise apnayen prasav paschat pariwar niyojan)'
    },
    {
      'id': 8,
      'filename': 'papf.mp4',
      'title': 'Post abortion family planning',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen garbhpat paschatpariwar niyojan)'
    }
  ];

   var ancVideos = [
    {
      'id': 1,
      'filename': 'anc.mp4',
      'title': 'ASHA AWWW VISIT',
      'methodName':'Get ANC checkups during pregnancy',
      'methodMsg':'(Garbhawasta mein jaanch karvaayn)'
    },
    {
      'id': 2,
      'filename': 'IFA.mp4',
      'title': 'ANM. DOC. CHECKUP',
      'methodName':'Take IFA during pregnancy',
      'methodMsg':'(Garbhawasta mein Iron ki goli khayen)'
    },
    {
      'id': 3,
      'filename': 'tt.mp4',
      'title': 'Weight',
      'methodName':'Get tetanus toxoid during pregnancy',
      'methodMsg':'(Garbhawasta mein tetanus ka tika lagvayen)'
    },
    {
      'id': 4,
      'filename': 'urineprotein.mp4',
      'title': 'TT',
      'methodName':'How to recognize danger signs during pregnancy',
      'methodMsg':'(Garbhawasta ke dauran khatron ke lakshan pehchane)'
    },
    {
      'id': 5,
      'filename': 'papf.mp4',
      'title': 'PAPF',
      'methodName':'Prepare for your delivery',
      'methodMsg':'(Prasav ki tayyari karein)'
    },
    {
      'id': 6,
      'filename': 'deliveryinhospital.mp4',
      'title': 'Paleness',
      'methodName':'Deliver in a hospital',
      'methodMsg':'(Aspatal mein hi prasav karaaein)'
    },
    {
      'id': 7,
      'filename': 'ppfp.mp4',
      'title': 'Night Blind',
      'methodName':'Take care of yourself after delivery',
      'methodMsg':'(Prasav ke bad apni dekhbhaal karein)'
    },
    {
      'id': 8,
      'filename': 'anemia.mp4',
      'title': 'Anaemia',
      'methodName':'Take care of yourself',
      'methodMsg':'(Prasav ke dauran apni dekhbhaal karein)'
    }/*,
    {
      'id': 9,
      'filename': 'malaria.mp4',
      'title': 'Malaria',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 10,
      'filename': 'ifaTablets.mp4',
      'title': 'IFA Tablets',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 11,
      'filename': 'bp.mp4',
      'title': 'BP',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 12,
      'filename': 'urineprotein.mp4',
      'title': 'Urine Protein',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 13,
      'filename': 'swelling.mp4',
      'title': 'Swelling',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 14,
      'filename': 'fits.mp4',
      'title': 'Fits/blurred vision/headache',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 15,
      'filename': 'urinesugar.mp4',
      'title': 'Urine Sugar',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 16,
      'filename': 'fever.mp4',
      'title': 'Fever',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 17,
      'filename': 'foulsmell.mp4',
      'title': 'Foul smelling Discharge',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    },
    {
      'id': 18,
      'filename': 'weakness.mp4',
      'title': 'Weakness/other illness',
      'methodName':'Male Sterilization',
      'methodMsg':'(kaise apnayen purush nasbandi)'
    }*/
  ];
  var childVideos = [
    {
      'id': 1,
      'filename': 'breastfeed.mp4',
      'title': 'ASHA AWWW VISIT',
      'methodName':'Breastfeed your baby',
      'methodMsg':'(Apne shishu ko stanpaan karaein)'
    },
    {
      'id': 2,
      'filename': 'newborncare.mp4',
      'title': 'ANM. DOC. CHECKUP',
      'methodName':'Take care of your newborn',
      'methodMsg':'(Navjaat shishu ki dekhbaal karein)'
    },
    {
      'id': 3,
      'filename': 'immunization.mp4',
      'title': 'Weight',
      'methodName':'Immunize your child',
      'methodMsg':'(Bachhe ka Tikakaran karaein)'
    },
    {
      'id': 4,
      'filename': 'poliodrops.mp4',
      'title': 'TT',
      'methodName':'Polio',
      'methodMsg':'(Bache ko polio ki khurak dilvaaein)'
    },
    {
      'id': 5,
      'filename': 'vitamina.mp4',
      'title': 'Anaemia',
      'methodName':'Vitamin A',
      'methodMsg':'(Bache ko Vitamin A ki khurak dilvaaein)'
    }
  ];

  var immunisationVideos = [
    {
      'id': 1,
      'filename': 'poliodrops.mp4',
      'title': 'Polio',
      'message':'Bache ko polio ki khurak dilvaaein'
    },
    {
      'id': 2,
      'filename': 'vitamina.mp4',
      'title': 'Vitamin A',
      'message':'Bache ko Vitamin A ki khurak dilvaaein'
    }
  ];

  var getFamilyPlanningVideos = function() {
    addPathToVideoCollection(familyPlanningVideos);
    return familyPlanningVideos;
  };

  var getANCVideos = function() {
    addPathToVideoCollection(ancVideos);
    return ancVideos;
  };

  var getChildVideos = function() {
    addPathToVideoCollection(childVideos);
    return childVideos;
  };

  var getImmunisationVideos = function() {
    addPathToVideoCollection(immunisationVideos);
    return immunisationVideos;
  };

  function addPathToVideoCollection(videoCollection) {
    videoCollection.map(function(e) {
      if(isDevice) {
        e.path =  baseVideosPath + e.filename;
      } else {
        e.path = baseVideosPath + 'sample.mp4'
      }
    });
    return videoCollection;
  }

  return {
    getFamilyPlanningVideos: getFamilyPlanningVideos,
    getANCVideos : getANCVideos,
    getChildVideos : getChildVideos,
    getImmunisationVideos:getImmunisationVideos
  }
});
