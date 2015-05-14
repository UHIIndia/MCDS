angular.module('uhiApp.services')
.factory('WomanService',['FileService','UtilityService', function(FileService, UtilityService){
  var womenList = FileService.readFromLocalStorage(true);
  // this function return a id i.e house#.womanNo , this will be visible to user 
  var generateVisibleWomanID = function(houseCode){
    var womanNo=0; //  is the number of woman in a particular house
       // find if this house is already present in the list
       angular.forEach(womenList, function(womanObj, index){
          if(womanObj.house == houseCode){
            womanNo++;
          }
       });
      return houseCode+"."+(womanNo+1);
  };
  // this function return a id i.e house#.womanNo , this will be visible to user 
  var generateActualWomanID = function(name, dob){
    var nameCode,dobCode; 
    if(angular.isDate(dob)){
      var dd= dob.getDate(), mm=dob.getMonth()+1, yyyy= dob.getFullYear();
      if(dd< 10)  dd ="0"+ dd;
      if(mm < 10) mm ="0"+mm;
      dobCode = dd+mm+yyyy;
    } else {
      //its a dd/mm/yyyy string
      dobCode = dob.replace(/\//g, "");
    }
   
   name ? nameCode = name.substring(0,2).toUpperCase() : nameCode = "NA";
   
      return UtilityService.getCityCode()+UtilityService.getSlumCode()+UtilityService.getWorkerCode()+nameCode+dobCode;
  };
  return {
    isWomanRegistered: function(womanID){
      // check if this woman is already in women list or not
      for(var i=0; i<womenList.length; i++){
        if(womanID === womenList[i].displayID){
          break;
        }
      }
      return i<womenList.length ;
    },
    getWomanDetails: function(womanID){
      // get the details of woman from all women list
      for(var i=0; i<womenList.length; i++){
        if(womanID === womenList[i].displayID){
          return womenList[i];
        }
      }
    },
    updateWomanDetails: function(womanObj){
      // save woman related details to 
      var womanDetails = this.getWomanDetails(womanObj.displayID);
      angular.forEach(womanObj, function(value, key){        
          womanDetails[key] = value;      
      });
      FileService.writeToLocalStorage(womenList, true);
    },
    addNewWoman: function (womanObj) {
      var womanID = generateActualWomanID(womanObj.name, womanObj.dob);
      var displayID = generateVisibleWomanID(womanObj.house);
      // add this woman to women List
      var dateISO = UtilityService.convertToDate(womanObj.dob).toISOString();
      womanObj.dob = dateISO;
      womanObj.womanID = womanID;
      womanObj.displayID = displayID;
      womanObj.city =UtilityService.getCityCode();
      womanObj.slum =UtilityService.getSlumCode();
      womanObj.worker = UtilityService.getWorkerCode();
      womanObj.registrationDate = new Date();
      womanObj.isCurrentlyBreastFeeding = null;
      womanObj.familyPlanningVisits = [];
      womanObj.LMP = null;
      womanObj.EDD = null;
      womanObj.deliveryDate = null;
      womanObj.maternalOutcome = null;
      womanObj.birthOutcome = null;
      womanObj.FPMethod = null;
      womanObj.ANC = null;      
      womenList.push(womanObj);      
      FileService.writeToLocalStorage(womenList, true);
        console.log(womenList);
        return womanID;      
    },
    getWomanList :function(){
      return womenList;
    },
    getPregWomanCategory:function(womanId){

      var pregList = womenList.filter(function(e) {
          return e.isPregnant === true;
        });
      console.log(pregList)
      var pregList = [];
      var notPregList =[];
      for(var i=0; i<womenList.length; i++){
        if(womenList[i].isPregnant == true){
          var pregObj= {id:womenList[i].displayID};
          pregList.push(pregObj)
        }else{
          var notPregObj= {id:womenList[i].displayID};
          notPregList.push(notPregObj);
        }
      }
      womanCategory.pregnant = pregList;
      womanCategory.notPregnant = notPregList;
      return womanCategory;
    },
    getWomanANCDetails:function(displayID){
      var actionCode =0;
      var womanData = this.getWomanDetails(displayID);
      var ANC = womanData.ANC;
      //womanData.EDD ="12//12/2015";
      if(ANC != null){
        var actionStatus =0;
        var today = new Date();
        var currentMonth = today.getMonth() + 1;
        var deliveryDateMonth = UtilityService.showMonthFromDate(womanData.EDD);
        if(deliveryDateMonth <= 8){
            deliveryDateMonth =parseInt(deliveryDateMonth)+ 12;
        }
        monthNo = deliveryDateMonth - 8;
        var i;
        for(i = 1; i <=9;i++){          //start from curentMonth
            if(monthNo == 13){         //MOVE TO JANUARY
                monthNo = 1;
            }
           if(currentMonth == monthNo){
            break;
           }
            monthNo++;
        }
        var pregMon= i;

        //check for anm doc checkup
        var actionANM = 0;
        if(ANC[pregMon -1].ANMVisit != null && pregMon !=9){
          actionANM = 0;
        }else{
          actionANM = 1;
        }

        //check for wt alert
        var actionCodeWt =0;
        var lastWt = ANC[pregMon -1].wt;
        var currentWt = ANC[pregMon].wt;
        if(lastWt != null){
          if(lastWt < 40){
            actionCodeWt =2;
          }else if(pregMon-1 > 3){
            for(var j = 1;j<pregMon-1;j++){
              if(ANC[j].wt != null &&  ANC[j].wt > wtVisits[i].value){
                actionCodeWt=2;
              }
            }
          }
        }
        if(currentWt != null){
          if(currentWt < 40){
            actionCodeWt =2;
          }else if(pregMon > 3){
            for(var j = 1;j<pregMon;j++){
              if(ANC[j].wt != null &&  ANC[j].wt > currentWt){
                actionCodeWt=2;
              }
            }
          }
        }

        //check for TT    
        var actionCodeTT =0,thisPregTT =0;
        var lastPregTT = (ANC[0].TT == null ? 0:parseInt(ANC.TT))
        for(i=1;i<= pregMon; i++){
          if(ANC[i].TT != null)
          thisPregTT += parseInt(ANC[i].TT); 
        }  
        if(thisPregTT > 2){             //no action  required
          actionCodeTT = 0;
        }else if(thisPregTT == 1  && lastPregTT < 1 || thisPregTT == 0){ 
          actionCodeTT = 1;                 //action required
        }
        
        //check for Anaemia
        var actionHB =0;
        var lastHB= ANC[pregMon-1].HB;
        var currentHB =ANC[pregMon].HB;
        if(lastHB != null){
          if(lastHB < 10){
            actionHB = 2;
          }
        }
        if(currentHB != null){
          if(currentHB < 10){
            actionHB = 2;
          }
        }
        //check for paleEye ,night blind
        var commonAction =0;
        var items =['paleEye','nightBlindness','bleeding','malaria','urineProtein','swelling','headache','urineSugar','fever','foulSmellingDischarge','otherInfection']
        for(var i=0 ;i< items.length;i++ ){
          var lastValue= ANC[pregMon-1][items[i]];
          var currentValue =ANC[pregMon][items[i]];
          if(lastValue == 'yes' || currentValue == 'yes'){  //if  any of the value is red ..then break it
            commonAction = 2
            break;
          }else{
            commonAction = 0;
          }
        }

        //check for IFA
        var actionIFA=0,totalIFA =0;
        for(var i=1;i <=pregMon;i++){
          if(ANC[i].IFA != null){
            totalIFA += ANC[i].IFA;
          }
        }
        if(totalIFA <100){
          actionIFA = 1;
        }
        //check for BP
        var actionBP = 0;
        var lastBPValue= ANC[pregMon-1].BP;
        var currentBPValue =ANC[pregMon].BP;
        if(lastValue == 'High' || currentValue == 'High'){  //if  any of the value is red ..then break it
          actionBP = 2
        }else{
          actionBP = 0;
        }

        //overall check for all checkups
        if(actionCodeWt == 2 || actionHB ==2 || commonAction ==2 || actionBP ==2){
          actionCode = 2;
        }else if(actionANM == 1|| actionCodeTT == 1 || actionIFA == 1){
          actionCode = 1;
        }else{
          actionCode = 0;
        }
      }else{
         actionCode = 1;
      }
      return actionCode;

    }
  }
}]);
