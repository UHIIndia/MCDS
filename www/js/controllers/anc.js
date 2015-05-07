angular.module('uhiApp.controllers')
.controller('AncController', function($scope,$state,$timeout,UtilityService,familyPlanning,videos,WomanService,ChildService,$location) {
 var womanDisplayID = UtilityService.getWomanDisplayID();
// womanDisplayID="pop.3"
console.log(womanDisplayID);
  var womanData = WomanService.getWomanDetails(womanDisplayID);
    console.log(womanData);
    var womanData1= { "womanID": "0121230250012001", // city+slum+worker+house+woman
        "name": null,
        "dob":  '20/12/1989',//'20/12/1989',
        "age":  26,
        "husbandName":"govind",
        "phone":  "5388234458",
        "house":"0012",
        "slum":"123",
        "city":"012",
        "worker":"025",
        "pregnencyNo":"3",
        "liveBirths":"2",
        "livingChildren":"2",
        "registrationDate":"16/12/2014",
        "youngestDOB":"18/7/2012",
        "isPregnant":"N",
        "FP":{
            "currentMonth":"iucd",
            "methodMonth1":"iucd",
            "methodMonth2":"iucd",
            "methodMonth3":"iucd",
            "methodMonth4":"iucd",
            "methodMonth5":"iucd",
            "methodMonth6":"iucd",
            "methodMonth7":"iucd",
            "methodMonth8":"iucd"

        },
        "LMP":'2/10/2015',
        "EDD":'2/4/2015',
     //   "LMP":null,
       // "EDD":null,
        "DeliveryDate":null,
        "MaternalOutcome":null,
        "BirthOutcome":null,
        "BirthWeight":null,
        "ANC":[{"monthID":1,
            "ASHAVisit":"2/2/2015",
            "ANMVisit":"2/4/2015",
            "weight":null,
            "TT":null,
            "HB":5,
            "paleEye":null,
            "bleeding":null,
            "malaria":null,
            "IFATablets":20,
            "BP":null,
            "swelling":null,
            "headache":null,
            "urineProtein":"yes",
            "urineSugar":null,
            "nightBlindness":null,
            "foulSmellingDischarge":null,
            "fever":null,
            "otherInfection":null
        },{
            "monthID":2,
            "ASHAVisit":null,
            "ANMVisit":"2/4/2015",
            "weight":45,
            "TT":2,
            "HB":5,
            "paleEye":"yes",
            "bleeding":'yes',
            "malaria":'yes',
            "IFATablets":30,
            "BP":"High",
            "swelling":'yes',
            "headache":'yes',
            "urineProtein":"no",
            "urineSugar":"yes",
            "nightBlindness":'yes',
            "foulSmellingDischarge":"yes",
            "fever":"yes",
            "otherInfection":"yes"
        }]
    };

//display DOB,Age,LMP,EDD,and the months by calling service 9/2/2015  2/11/2015       date month year
    var pregnancyMonthNo;
    var AshaVisitArray=[];
    var ANMVisitArray=[];
    var lastAshaVistMonth,lastAshaVistDate,lastANMVistMonth,lastANMVisitDate;
    var  ashaCountTotal=0;
    var ANMCountTotal=0;
    var pregnancyMonthNoArray=[];
    var monthNo,LMP,EDD,currentMonth;
    $scope.dateOfDelivery=true;
    $scope.enableNewBorn =true;
    $scope.enterButton = false;
    $scope.pregWomanExist=true;
    $scope.disableButton=false;
    $scope.pregWomanName = (womanData == undefined?'' :womanData.name);
    $scope.pregWomanPath = UtilityService.loadImage(womanData.womanID);
    //$scope.ancDOB = womanData.dob;
    $scope.ancAge =UtilityService.calcAge(womanData.dob, true);
    $scope.newWoman=false;

    $scope.enterPregnantWomanDetails=function(){
        if($scope.LMPCalendarDate && $scope.EDDCalendarDate){
              $scope.pregWomanExist=true;
              $scope.newWoman=true;
              womanData.LMP = $scope.LMPCalendarDate;
              womanData.EDD = $scope.EDDCalendarDate;  
              showPregDetails($scope.LMPCalendarDate,$scope.EDDCalendarDate);
        }
     }
     //check for whther the woman has prgnant details or she is a new woman
    if(womanData.LMP == null || womanData.EDD == null ){           //a new woamn
        $scope.enterButton=true;
        $scope.pregWomanExist=false;
    }else{
        var LMP =  womanData.LMP; // 9/2/2015
        var EDD = womanData.EDD;
        showPregDetails(LMP,EDD);
    }
    function showPregDetails(LMP,EDD){
     
    $scope.pregWomanExist=true;                //already exists
    $scope.disableButton=true;       
    $scope.LMPCalendarDate = LMP;
    $scope.EDDCalendarDate = EDD;
    console.log("prewomandetails");
     console.log($scope.LMPCalendarDate )
    console.log($scope.EDDCalendarDate )
    $scope.EDDCalendarDate = EDD;
    $scope.monthsArray = [];
    $scope.chooseMonth = 5;
    var todayDate=new Date();
     $scope.symptomData=[];
    $scope.totalAshaCount = 0;
    currentMonth = todayDate.getMonth()+1;         //get the current month


    //need to derive the first month of pregnancy
    var d = new Date();
    var deliveryDateMonth = UtilityService.showMonthFromDate($scope.EDDCalendarDate);
    var edd= UtilityService.convertToDate($scope.EDDCalendarDate);
    var deliveryDateYear = edd.getFullYear()
    if(deliveryDateMonth <= 8){
        deliveryDateMonth =parseInt(deliveryDateMonth)+ 12;
    }
    monthNo = deliveryDateMonth-8;
    $scope.monthsArray.push({'monthNo':0,'monthName':'','pregnancyMonthNo':0,'monthYear':0});
    for(var i = 1; i <=9;i++){
        if(monthNo == 13){         //MOVE TO JANUARY
            monthNo = 1;
        }
        var monthName = UtilityService.showMonth(monthNo);
        var month={'monthNo':monthNo,'monthName':monthName,'pregnancyMonthNo':i,'monthYear':0};
        $scope.monthsArray.push(month);
        monthNo++;

    }
    for (i=9;i>=1;i--){
        if( $scope.monthsArray[i].monthNo == 12 && i != 8){
            deliveryDateYear=deliveryDateYear - 1;
        }
         $scope.monthsArray[i].monthYear = deliveryDateYear;
    }
    console.log("monghs array len"+  $scope.monthsArray.length )
    //set path for anc videos

      $scope.video = {};

      $scope.video.list = videos.getANCVideos();

      $scope.video.play = function(id) {
        var selectedVideo = $scope.video.list.filter(function(e) {
          return e.id === id;
        });
        $scope.video.path = selectedVideo[0].path;
        $scope.video.show = true;
        $timeout(function() {
          document.getElementById('selected-video').play();
        }, 1000);
      };

      $scope.video.stop = function() {
        document.getElementById('selected-video').pause();
        $scope.video.show = false;
      };

    //SET VARIABLE FOR CLASS IN FP METHOD
    if(currentMonth == $scope.monthsArray[8].monthNo){ //if the current month is the 8th month
        $scope.FPmonth1=-1;
        $scope.FPmonth2 = currentMonth;
        $scope.FPmonth3 = currentMonth+1;       
    }else if(currentMonth == $scope.monthsArray[9].monthNo){
    ////if the current month is the 9th month
        $scope.FPmonth1=-1;
        $scope.FPmonth2 = -1;
        $scope.FPmonth3 = currentMonth;       
    }else{
        $scope.FPmonth1=$scope.monthsArray[7].monthNo;
        $scope.FPmonth2 = $scope.monthsArray[8].monthNo;
        $scope.FPmonth3 = $scope.monthsArray[9].monthNo;       
    }
    //logic for asha visit and ANMVisit
    $scope.visitDetails = {};
    var ashaVisits=[];
    $scope.ashaCalendarDate = todayDate; //set the calendar date to today
    $scope.ashaCountTotal=0;
    if($scope.newWoman == false){
         var storedAshaVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.ASHAVisit;
            }).map(function(e) { 
            return {monthID: e.monthID,value: e.ASHAVisit};
            }).value();
        ashaVisits = getVisits(storedAshaVisits);
        $scope.ashaCountTotal = ashaVisits.length;  
        $scope.lastAshaVistMonth = (ashaVisits.length == 0?'': ashaVisits[ashaVisits.length -1].monthNo);
        $scope.lastAshaVistDate = (ashaVisits.length == 0?'': ashaVisits[ashaVisits.length-1].value);
        $scope.visitDetails.ashaVisits = _.indexBy(ashaVisits, 'monthNo')
        if($scope.lastAshaVistMonth == currentMonth){
            if(currentMonth == 12){
                 $scope.nextAshaVisitMonth =1;   
            }else{
                $scope.nextAshaVisitMonth = currentMonth+1;
            }
            
        }else{
            $scope.nextAshaVisitMonth = currentMonth;
        }
    }else{
            $scope.nextAshaVisitMonth = currentMonth;
            $scope.lastAshaVistDate='';
    }

    var ashaInitializing = true;
    $scope.$watch(function(scope) {return $scope.ashaCalendarDate},
        function() {
            if (ashaInitializing) {
                $timeout(function() { ashaInitializing = false; });
            } else {

                // do whatever you were going to do
                $scope.ashaCountTotal = ashaVisits.length +1;
                //to ensure last mon doesnt retain the last changed value
                $scope.lastAshaVistMonth = (ashaVisits.length == 0?'': ashaVisits[ashaVisits.length -1].monthNo);
               // var diff = UtilityService.calcDiffDates(pastYrTime,$scope.ashaCalendarDate);
                var ashaCalendarDate = UtilityService.convertDateFormat($scope.ashaCalendarDate);
                var ashaCalendarMonth = UtilityService.showMonthFromDate(ashaCalendarDate);
                var ashaCalendarYear = $scope.ashaCalendarDate.getFullYear();
                checkUpforPale("ashaVisits",ashaCalendarMonth,ashaCalendarDate,ashaCalendarYear);
                var lastStoredMonth = (ashaVisits.length == 0 ?'' :ashaVisits[ashaVisits.length-1].pregnancyMonthNo);
                var selectedmonth = $scope.lastObj.ashaVisits.pregnancyMonthNo;
                if(lastStoredMonth < selectedmonth){
                    $scope.lastAshaVistMonth = $scope.lastObj.ashaVisits.monthNo;
                }
                if($scope.lastAshaVistMonth == currentMonth){
                    if(currentMonth == 12){
                         $scope.nextAshaVisitMonth =1;   
                    }else{
                        $scope.nextAshaVisitMonth = currentMonth+1;
                    }
                }else{
                    $scope.nextAshaVisitMonth = currentMonth;
                }
            }
        }
    );
    //logic for ANC CheckUp
    $scope.ANMCalendarDate=todayDate;
    var anmVisits=[];
    $scope.ANMCountTotal=0;
    if($scope.newWoman == false){
        var storedANMVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.ANMVisit;
            }).map(function(e) { 
            return {monthID: e.monthID,value: e.ANMVisit};
            }).value();
        anmVisits = getVisits(storedANMVisits);
        $scope.ANMCountTotal = anmVisits.length;  
        $scope.lastANMVistMonth = (anmVisits.length == 0?'': anmVisits[anmVisits.length -1].monthNo);
        $scope.lastANMVistDate = (anmVisits.length == 0?'': anmVisits[anmVisits.length-1].value);
        $scope.visitDetails.anmVisits = _.indexBy(anmVisits, 'monthNo')
        if($scope.lastANMVistMonth == currentMonth){
            if(currentMonth == $scope.monthsArray[8].monthNo){        // if current mon is 8    next visit is 9
                if(currentMonth == 12){
                    $scope.nextANMVisitMonth = 1; 
                }else{
                    $scope.nextANMVisitMonth = currentMonth + 1;  
                }                  //   checked
            }else if(currentMonth == $scope.monthsArray[9].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                if(currentMonth == 12){
                    $scope.nextANMVisitMonth = 1; 
                }else{
                    $scope.nextANMVisitMonth = currentMonth + 1;  
                }                            //
            }else{
                if(currentMonth == 12){
                    $scope.nextANMVisitMonth = 2; 
                }else{
                    $scope.nextANMVisitMonth = currentMonth + 2;  
                }                                                      //if current mon is 7or less..it will add 2.. //checked
            }
        }else{
            if(currentMonth == $scope.monthsArray[8].monthNo ){             //if current month is 8
                if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                    $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                    $scope.nextANMVisitMonth = 2;
                }else{
                    $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                }
            }else if(currentMonth == $scope.monthsArray[9].monthNo ){       //if the current mon is 9
                $scope.nextANMVisitMonth = currentMonth;                               //
            }else{                                                  //if the current month is 7  or less
                if($scope.lastANMVistMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                    $scope.nextANMVisitMonth = currentMonth + 1;                      //checked
                }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                    $scope.nextANMVisitMonth = 2;
                }else{
                    $scope.nextANMVisitMonth=currentMonth;                         //checked
                }
            }
        }
    } else{
                $scope.nextANMVisitMonth=currentMonth; 
                $scope.lastANMVisitDate='';
    } 
    var ANMInitializing = true;
    $scope.$watch(function(scope) {return $scope.ANMCalendarDate},
        function() {
            if (ANMInitializing) {
                $timeout(function() { ANMInitializing = false; });
            } else {
                // do whatever you were going to do
                $scope.ANMCountTotal = anmVisits.length +1;
                //to ensure last mon doesnt retain the last changed value
                $scope.lastANMVistMonth = (anmVisits.length == 0?'': anmVisits[anmVisits.length -1].monthNo);
               // var diff = UtilityService.calcDanmVisitsiffDates(pastYrTime,$scope.ashaCalendarDate);
                var anmCalendarDate = UtilityService.convertDateFormat($scope.ANMCalendarDate);
                var anmCalendarMonth = UtilityService.showMonthFromDate(anmCalendarDate);
                var anmCalendarYear = $scope.ANMCalendarDate.getFullYear();
                checkUpforPale("anmVisits",anmCalendarMonth,anmCalendarDate,anmCalendarYear);
                var lastStoredMonth = (anmVisits.length == 0?'' :anmVisits[anmVisits.length-1].pregnancyMonthNo);
                var selectedmonth = $scope.lastObj.anmVisits.pregnancyMonthNo;
                if(lastStoredMonth < selectedmonth){
                    $scope.lastANMVistMonth = $scope.lastObj.anmVisits.monthNo;
                }
                //if calendar month is equal to current month
                if($scope.lastANMVistMonth == currentMonth){
                    if(currentMonth == $scope.monthsArray[8].monthNo){        // if current mon is 8    next visit is 9
                        if(currentMonth == 12){
                            $scope.nextANMVisitMonth = 1; 
                        }else{
                            $scope.nextANMVisitMonth = currentMonth + 1;  
                        }                  //   checked
                    }else if(currentMonth == $scope.monthsArray[9].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                        if(currentMonth == 12){
                            $scope.nextANMVisitMonth = 1; 
                        }else{
                            $scope.nextANMVisitMonth = currentMonth + 1;  
                        }                            //
                    }else{
                        if(currentMonth == 12){
                            $scope.nextANMVisitMonth = 2; 
                        }else{
                            $scope.nextANMVisitMonth = currentMonth + 2;  
                        }                                                      //if current mon is 7or less..it will add 2.. //checked
                    }
                }else{
                    if(currentMonth == $scope.monthsArray[8].monthNo ){             //if current month is 8
                        if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                            $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                        }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                            $scope.nextANMVisitMonth = 2;
                        }else{
                            $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                        }
                    }else if(currentMonth == $scope.monthsArray[9].monthNo ){       //if the current mon is 9
                        $scope.nextANMVisitMonth = currentMonth;                               //
                    }else{                                                  //if the current month is 7  or less
                        if($scope.lastANMVistMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                            $scope.nextANMVisitMonth = currentMonth + 1;                      //checked
                        }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                            $scope.nextANMVisitMonth = 2;
                        }else{
                            $scope.nextANMVisitMonth=currentMonth;                         //checked
                        }
                    }
                }
            }
        }
    );

    // LOGIC FOR WT
    var wtVisits=[];
    var storedWtVisits=[];
    $scope.WeightCalendarDate=todayDate;
    if($scope.newWoman == false){
         storedWtVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.weight;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.weight};
            }).value();
        wtVisits = getVisits(storedWtVisits);
        if(wtVisits.length >0){
            for(var i=0;i< wtVisits.length;i++){
                //if the wt alert is less than 40 then red
                if(wtVisits[i].value <40 ){
                    wtVisits[i].weightAlert =true;
                }else if(wtVisits[i].pregnancyMonthNo > 3){         //else check for wt less than 
                    for(var j=1;j<i;j++){
                        if(wtVisits[j] !=undefined && wtVisits[j].value > wtVisits[i].value){
                             wtVisits[i].weightAlert =true;
                        }
                    }
                }

            }
        }    
        $scope.visitDetails.wtVisits = _.indexBy(wtVisits, 'monthNo')
        
     } else{
        //lastWtObject.value =0;
     } 
    $scope.$watch(function(scope) {return $scope.WeightCalendarDate},
        function() {
                if($scope.enteredWeight){
                    var currentWt = $scope.enteredWeight;
                    updateRowforVisits("wtVisits",currentWt,$scope.WeightCalendarDate);
                    var currentWtMonth = $scope.lastObj.wtVisits.monthNo;
                    var currentPregMonth = $scope.lastObj.wtVisits.pregnancyMonthNo;
                    if(currentWt < 40){
                        $scope.lastObj.wtVisits.weightAlert = true;
                    }else if(currentPregMonth > 3){         //else check for wt lFchess than 
                            for(var j=1;j<currentPregMonth;j++){
                                 if(wtVisits[j] !=undefined){    //if the last velue is greater than current and its no is les than curent month
                                     if(wtVisits[j].value > currentWt && wtVisits[j].pregnancyMonthNo < currentPregMonth){
                                         $scope.lastObj.wtVisits.weightAlert =true;
                                    }
                                 }
                            }
                    }
                }
        }
    );
    $scope.updateWeight=function(){
       if(isNaN($scope.enteredWeight) == false){
                     var currentWt = $scope.enteredWeight;
                    updateRowforVisits("wtVisits",currentWt,$scope.WeightCalendarDate);
                    var currentWtMonth = $scope.lastObj.wtVisits.monthNo;
                    var currentPregMonth = $scope.lastObj.wtVisits.pregnancyMonthNo;
                    if(currentWt < 40){
                        $scope.lastObj.wtVisits.weightAlert = true;
                    }else if(currentPregMonth > 3){         //else check for wt lFchess than 
                            for(var j=1;j<currentPregMonth;j++){
                                 if(wtVisits[j] !=undefined){    //if the last velue is greater than current and its no is les than curent month
                                     if(wtVisits[j].value > currentWt && wtVisits[j].pregnancyMonthNo < currentPregMonth){
                                         $scope.lastObj.wtVisits.weightAlert =true;
                                    }
                                 }
                            }
                    }
        }

    }


    //LOGIC FOR Malaria
    var malariaVisits=[];
    var storedMalariaVisits=[];
    $scope.MalariaCalendarDate = todayDate;
    if($scope.newWoman == false){
        var storedMalariaVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.Malaria;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.Malaria};
            }).value();
         malariaVisits = getVisits(storedMalariaVisits);    
        $scope.visitDetails.malariaVisits = _.indexBy(malariaVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.MalariaCalendarDate},
        function() {
                if($scope.malariaOutcome){
                    updateRowforVisits("malariaVisits",$scope.malariaOutcome,$scope.MalariaCalendarDate);
                }
        }
    );
    $scope.updateMalaria=function(){
        if($scope.malariaOutcome) {
                   updateRowforVisits("malariaVisits",$scope.malariaOutcome,$scope.MalariaCalendarDate);
                }
    }


//LOGIC FOR TT
//need to apply the loop as a the last anc object can be empty for HB
    $scope.TTCalendarDate = todayDate;
    var TTVisits=[];
    var totalTTCount =0;
    if($scope.newWoman == false){
         var storedTTVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.TT;
            }).map(function(e) { 
            return {monthID: e.monthID,value: e.TT};
            }).value();
        TTVisits = getVisits(storedTTVisits);
        for(var i=0;i < TTVisits.length;i++){
            totalTTCount = parseInt(totalTTCount) + parseInt(TTVisits[i].value);
        }
        $scope.lastTTMonth = (TTVisits.length == 0?'': TTVisits[TTVisits.length -1].monthNo);
        $scope.visitDetails.TTVisits = _.indexBy(TTVisits, 'monthNo')
        if(totalTTCount >=2){
            $scope.nextTTMonth=0;
            $scope.alertTT= false;
        }else if(totalTTCount == 1 || totalTTCount == 0){
            if($scope.lastTTMonth == currentMonth){
                if(currentMonth == $scope.monthsArray[8].monthNo){        // if current mon is 8    next visit is 9
                    if(currentMonth == 12){
                        $scope.nextTTMonth = 1; 
                    }else{
                        $scope.nextTTMonth = currentMonth + 1;  
                    }                  //   checked
                }else if(currentMonth == $scope.monthsArray[9].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                    if(currentMonth == 12){
                        $scope.nextTTMonth = 1; 
                    }else{
                        $scope.nextTTMonth = currentMonth + 1;  
                    }                           
                }else{
                    if(currentMonth == 12){
                        $scope.nextTTMonth = 2; 
                    }else{
                        $scope.nextTTMonth = currentMonth + 2;  
                    }                                                      //if current mon is 7or less..it will add 2.. //checked
                }
            }else{
                if(currentMonth == $scope.monthsArray[8].monthNo ){             //if current month is 8
                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                        $scope.nextTTMonth = 2;
                    }else{
                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                    }
                }else if(currentMonth == $scope.monthsArray[9].monthNo ){       //if the current mon is 9
                    $scope.nextTTMonth = currentMonth;                               //
                }else{                                                  //if the current month is 7  or less
                    if($scope.lastTTMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                        $scope.nextTTMonth = currentMonth + 1;                      //checked
                    }else if($scope.lastTTMonth == 12 &&  currentMonth == 1){
                        $scope.nextTTMonth = 2;
                    }else{
                        $scope.nextTTMonth=currentMonth;                         //checked
                    }
                }
            }
            $scope.alertTT= true;
        }    
    }else{
            //$scope.nextTTMonth = currentMonth;
            //$scope.lastTTCount='';
            //$scope.alertTT = true;
    }
     $scope.totalTTCount = totalTTCount;
    var finalCount=totalTTCount;
    var TTInitializing =true;
    $scope.$watch(function(scope) {return $scope.TTCalendarDate},
        function() {
                if (TTInitializing) {
                $timeout(function() { TTInitializing = false; });
                } else {
                    totalTTCount = finalCount+1;
                    lastTTCount = 1;
                    $scope.enteredTT = ($scope.enteredTT == undefined || $scope.enteredTT == ''? 0:$scope.enteredTT);
                    var TTCalendarDate = UtilityService.convertDateFormat($scope.TTCalendarDate);
                    var TTCalendaMonth = UtilityService.showMonthFromDate(TTCalendarDate);
                    var TTCalendarYear = $scope.TTCalendarDate.getFullYear();
                    checkUpforPale("TTVisits",TTCalendaMonth,lastTTCount,TTCalendarYear);
                    var lastStoredMonth = (TTVisits.length == 0 ?'' :TTVisits[TTVisits.length-1].pregnancyMonthNo);
                    var selectedmonth = $scope.lastObj.TTVisits.pregnancyMonthNo;
                    if(lastStoredMonth < selectedmonth){
                        $scope.lastTTMonth = $scope.lastObj.TTVisits.monthNo;
                    }
                    var enteredTT = $scope.enteredTT;   //TOTSL TT doesnt include entered tt
                       if(totalTTCount >=2){         //if the total tt in current preg is 2 or more..no need for more
                            $scope.nextTTMonth = -1;
                            $scope.alertTT= false;
                        }else if(totalTTCount == 1  && enteredTT < 1 || totalTTCount == 0){ //if total is 0...then must
                            if($scope.lastTTMonth == currentMonth){                         //if the total is 1..then in previous 1  then no else must
                                if(currentMonth == $scope.monthsArray[8].monthNo){        // if current mon is 8    next visit is 9
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                  //   checked
                                }else if(currentMonth == $scope.monthsArray[9].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                           
                                }else{
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 2; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 2;  
                                    }                                                      //if current mon is 7or less..it will add 2.. //checked
                                }
                            }else{
                                if(currentMonth == $scope.monthsArray[8].monthNo ){             //if current month is 8
                                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                                    }
                                }else if(currentMonth == $scope.monthsArray[9].monthNo ){       //if the current mon is 9
                                    $scope.nextTTMonth = currentMonth;                               //
                                }else{                                                  //if the current month is 7  or less
                                    if($scope.lastTTMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                                        $scope.nextTTMonth = currentMonth + 1;                      //checked
                                    }else if($scope.lastTTMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth=currentMonth;                         //checked
                                    }
                                }
                            }
                            $scope.alertTT= true;
                        }else{
                             $scope.alertTT= false;
                        }
                    totalTTCount = parseInt(totalTTCount) + parseInt(enteredTT);
                    $scope.totalTTCount = totalTTCount;
             }       
        }
    );

   $scope.updateTT=function(){
            if($scope.enteredTT){
                         totalTTCount = finalCount+1;
                    lastTTCount = 1;
                    $scope.enteredTT = ($scope.enteredTT == undefined ? 0:$scope.enteredTT);
                    var TTCalendarDate = UtilityService.convertDateFormat($scope.TTCalendarDate);
                    var TTCalendaMonth = UtilityService.showMonthFromDate(TTCalendarDate);
                    var TTCalendarYear = $scope.TTCalendarDate.getFullYear();
                    checkUpforPale("TTVisits",TTCalendaMonth,lastTTCount,TTCalendarYear);
                    var lastStoredMonth = (TTVisits.length == 0 ?'' :TTVisits[TTVisits.length-1].pregnancyMonthNo);
                    var selectedmonth = $scope.lastObj.TTVisits.pregnancyMonthNo;
                    if(lastStoredMonth < selectedmonth){
                        $scope.lastTTMonth = $scope.lastObj.TTVisits.monthNo;
                    }
                    var enteredTT = $scope.enteredTT;   //TOTSL TT doesnt include entered tt
                       if(totalTTCount >=2){         //if the total tt in current preg is 2 or more..no need for more
                            $scope.nextTTMonth = -1;
                            $scope.alertTT= false;
                        }else if(totalTTCount == 1  && enteredTT < 1 || totalTTCount == 0){ //if total is 0...then must
                            if($scope.lastTTMonth == currentMonth){                         //if the total is 1..then in previous 1  then no else must
                                if(currentMonth == $scope.monthsArray[8].monthNo){        // if current mon is 8    next visit is 9
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                  //   checked
                                }else if(currentMonth == $scope.monthsArray[9].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                           
                                }else{
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 2; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 2;  
                                    }                                                      //if current mon is 7or less..it will add 2.. //checked
                                }
                            }else{
                                if(currentMonth == $scope.monthsArray[8].monthNo ){             //if current month is 8
                                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                                    }
                                }else if(currentMonth == $scope.monthsArray[9].monthNo ){       //if the current mon is 9
                                    $scope.nextTTMonth = currentMonth;                               //
                                }else{                                                  //if the current month is 7  or less
                                    if($scope.lastTTMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                                        $scope.nextTTMonth = currentMonth + 1;                      //checked
                                    }else if($scope.lastTTMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth=currentMonth;                         //checked
                                    }
                                }
                            }
                            $scope.alertTT= true;
                        }else{
                             $scope.alertTT= false;
                        }
                    totalTTCount = parseInt(totalTTCount) + parseInt(enteredTT);
                    $scope.totalTTCount = totalTTCount;
            }                
   }

//LOGIC FOR ANAEMIA
    $scope.HBCalendarDate=todayDate;
    var HBVisits=[];
    var storedHBVisits=[];
     var lastHBObject={};
     if($scope.newWoman == false){
        storedHBVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.HB;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.HB};
            }).value();
        hbVisits = getVisits(storedHBVisits);
        if(hbVisits.length >0){
            for(var i=0;i< hbVisits.length;i++){
                if(hbVisits[i].value < 10 ){
                    hbVisits[i].hbAlert =true;
                }
            }
        }    
        $scope.visitDetails.hbVisits = _.indexBy(hbVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.HBCalendarDate},
        function() {
                if(isNaN($scope.enteredHB)== false){
                    var currentHB = $scope.enteredHB;
                    updateRowforVisits("hbVisits",currentHB,$scope.HBCalendarDate);
                    if(currentHB < 10){
                        $scope.lastObj.hbVisits.hbAlert = true;
                    }else{
                        $scope.lastObj.hbVisits.hbAlert = false;
                    }
                }
        }
    );
    $scope.updateHB=function(){
        var enteredHB = $scope.enteredHB;
            if(isNaN($scope.enteredHB)== false){
                    var currentHB = $scope.enteredHB;
                    updateRowforVisits("hbVisits",currentHB,$scope.HBCalendarDate);
                    if(currentHB < 10){
                        $scope.lastObj.hbVisits.hbAlert = true;
                    }else{
                        $scope.lastObj.hbVisits.hbAlert = false;
                    }
                }
    }  
//LOGIC FOR Pale Eye
    var paleEyeVisits=[];
    $scope.PaleCalendarDate = todayDate;
    var storedPaleEyeVisits=[];
     if($scope.newWoman == false){
        var storedPaleEyeVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.paleEye;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.paleEye};
            }).value();
         paleEyeVisits = getVisits(storedPaleEyeVisits);    
        $scope.visitDetails.paleEyeVisits = _.indexBy(paleEyeVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.PaleCalendarDate},
        function() {
                if($scope.paleOutcome){
                    updateRowforVisits("paleEyeVisits",$scope.paleOutcome,$scope.PaleCalendarDate);
                }
        }
    );
    $scope.updatePale=function(){
        if($scope.paleOutcome) {
                  updateRowforVisits("paleEyeVisits",$scope.paleOutcome,$scope.PaleCalendarDate);
                }
    }

    //LOGIC FOR Night Blindness
    var nightBlindVisits=[];
    $scope.NightBlindCalendarDate = todayDate;
     if($scope.newWoman == false){
        var storedNightBlindVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.nightBlindness;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.nightBlindness};
            }).value();
        nightBlindVisits = getVisits(storedNightBlindVisits);    
        $scope.visitDetails.nightBlindVisits = _.indexBy(nightBlindVisits, 'monthNo')

     }else{

     }
    $scope.$watch(function(scope) {return $scope.NightBlindCalendarDate},
    function() {
                if($scope.blindOutcome){
                    updateRowforVisits("nightBlindVisits",$scope.blindOutcome,$scope.NightBlindCalendarDate);
                }
        }
    );
    $scope.updateBlind=function(){
        if($scope.blindOutcome) {
                   updateRowforVisits("nightBlindVisits",$scope.blindOutcome,$scope.NightBlindCalendarDate);
                }
    }
 
    //LOGIC FOR Bleeding
    $scope.BleedingCalendarDate = todayDate;
    var bleedingVisits=[];
    var storedBleedingVisits=[];
     if($scope.newWoman == false){
        var storedBleedingVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.bleeding;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.bleeding};
            }).value();
         bleedingVisits = getVisits(storedBleedingVisits);    
        $scope.visitDetails.bleedingVisits = _.indexBy(bleedingVisits, 'monthNo')
     }else{
       
     }   
    $scope.$watch(function(scope) {return $scope.BleedingCalendarDate},
        function() {
                if($scope.bleedingOutcome){
                    updateRowforVisits("bleedingVisits",$scope.bleedingOutcome,$scope.BleedingCalendarDate);
                }
        }
    );
    $scope.updateBleed=function(){
        if($scope.bleedingOutcome) {
                   updateRowforVisits("bleedingVisits",$scope.bleedingOutcome,$scope.BleedingCalendarDate);
                }
    }

    //LOGIC FOR Malaria
    $scope.MalariaCalendarDate = todayDate;
     var malariaVisits=[];
    var storedmalariaVisits=[];
    if($scope.newWoman == false){
         storedmalariaVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.malaria;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.malaria};
            }).value();
         malariaVisits = getVisits(storedmalariaVisits);    
        $scope.visitDetails.malariaVisits = _.indexBy(malariaVisits, 'monthNo')
     lastMalariaObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.malaria};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.MalariaCalendarDate},
        function() {
                if($scope.malariaOutcome){
                   updateRowforVisits("malariaVisits",$scope.malariaOutcome,$scope.MalariaCalendarDate);
                }
        }
    );
    $scope.updateMalaria=function(){
        if($scope.malariaOutcome) {
                   updateRowforVisits("malariaVisits",$scope.malariaOutcome,$scope.MalariaCalendarDate);
                }
    }


//LOGIC FOR IFA Tab;lets
    $scope.IFACalendarDate = todayDate;
    var IFAVisits=[];
    var totalIFACount=0;
    var lastIFAMonth;
//need to apply the loop as a the last anc object can be empty for HB
    if($scope.newWoman == false){
        var storedIFAVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.IFATablets;
            }).map(function(e) { 
            return {monthID: e.monthID,value: e.IFATablets};
            }).value();
        IFAVisits = getVisits(storedIFAVisits);
        for(var i=0;i < IFAVisits.length;i++){
            totalIFACount = parseInt(totalIFACount) + parseInt(IFAVisits[i].value);
        }
        $scope.lastIFAMonth = (IFAVisits.length == 0?'': IFAVisits[IFAVisits.length -1].monthNo);
        $scope.visitDetails.IFAVisits = _.indexBy(IFAVisits, 'monthNo')
        if(totalIFACount <= 100){
            if(lastIFAMonth == currentMonth){
                if(currentMonth == 12){
                     $scope.nextIFAVisit = 1;
                }else{
                     $scope.nextIFAVisit = currentMonth+1;
                }
            }else{
                $scope.nextIFAVisit = currentMonth;
            }
            $scope.alertIFA = true;
        }
        
     }else{
            $scope.nextIFAVisit = currentMonth;
            lastIFACount=0;
            $scope.alertIFA = true;
     }   
     $scope.totalIFACount=totalIFACount;
     $scope.$watch(function(scope) {return $scope.IFACalendarDate},
        function() {
                if($scope.enteredIFA){
                    var currentIFA = $scope.enteredIFA;
                    $scope.totalIFACount = parseInt(totalIFACount) + parseInt(currentIFA);
                    var lastIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastIFAMonth = UtilityService.showMonthFromDate(lastIFADate);
                    var lastIFAYear = $scope.IFACalendarDate.getFullYear();
                    checkUpforPale("IFAVisits",lastIFAMonth,currentIFA,lastIFAYear);
                    //case when past mon is not the same as current month
                    var lastStoredMonth = (IFAVisits.length == 0 ?'' :IFAVisits[IFAVisits.length-1].pregnancyMonthNo);
                    var selectedmonth = $scope.lastObj.IFAVisits.pregnancyMonthNo;
                    if(lastStoredMonth < selectedmonth){
                        $scope.lastIFAMonth = $scope.lastObj.IFAVisits.monthNo;
                    }
                    if($scope.totalIFACount <= 100){
                        if(lastIFAMonth == currentMonth){
                            if(currentMonth == 12){
                                 $scope.nextIFAVisit = 1;
                            }else{
                                 $scope.nextIFAVisit = currentMonth+1;
                            }
                        }else{
                            $scope.nextIFAVisit = currentMonth;
                        }
                        $scope.alertIFA = true;
                    }else{
                        $scope.alertIFA = false;
                    }

                }
        }
    );
    $scope.updateIFA=function(){
         if(isNaN($scope.enteredIFA) == false){
                    var currentIFA = $scope.enteredIFA;
                    $scope.totalIFACount = parseInt(totalIFACount) + parseInt(currentIFA);
                    var lastIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastIFAMonth = UtilityService.showMonthFromDate(lastIFADate);
                    var lastIFAYear = $scope.IFACalendarDate.getFullYear();
                    checkUpforPale("IFAVisits",lastIFAMonth,currentIFA,lastIFAYear);
                    //case when past mon is not the same as current month
                    var lastStoredMonth = (IFAVisits.length == 0 ?'' :IFAVisits[IFAVisits.length-1].pregnancyMonthNo);
                    var selectedmonth = $scope.lastObj.IFAVisits.pregnancyMonthNo;
                    if(lastStoredMonth < selectedmonth){
                        $scope.lastIFAMonth = $scope.lastObj.IFAVisits.monthNo;
                    }
                    if($scope.totalIFACount <= 100){
                        if(lastIFAMonth == currentMonth){
                            if(currentMonth == 12){
                                 $scope.nextIFAVisit = 1;
                            }else{
                                 $scope.nextIFAVisit = currentMonth+1;
                            }
                        }else{
                            $scope.nextIFAVisit = currentMonth;
                        }
                        $scope.alertIFA = true;
                    }else{
                        $scope.alertIFA = false;
                    }
                }
    }

 //LOGIC FOR BP
    $scope.BPCalendarDate = todayDate;
    var BPVisits=[];
    var storedBPVisits=[];
     if($scope.newWoman == false){
        var storedBPVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.BP;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.BP};
            }).value();
         BPVisits = getVisits(storedBPVisits);    
        $scope.visitDetails.BPVisits = _.indexBy(BPVisits, 'monthNo')
     }else{

     }  
    $scope.$watch(function(scope) {return $scope.BPCalendarDate},
        function() {
                if($scope.BPOutcome){
                    updateRowforVisits("BPVisits",$scope.BPOutcome,$scope.BPCalendarDate);
                }
        }
    );
    //WHEN THE USER SELECTS YES OR NO
    $scope.updateBP=function(){
        if($scope.BPOutcome) {
                    updateRowforVisits("BPVisits",$scope.BPOutcome,$scope.BPCalendarDate);
        }
    }
    $scope.updateBPNo=function(){
        var highBP = $scope.enteredBPHigh;
        var lowBP =  $scope.enteredBPLow;
        if(highBP && lowBP){
            if(highBP > 140 || lowBP >90 ){
                $scope.BPOutcome = "High";
            }else{
                $scope.BPOutcome = "Normal";   
            }
             updateRowforVisits("BPVisits",$scope.BPOutcome,$scope.BPCalendarDate);
        }
            
    }
 
//LOGIC FOR UP
    $scope.UPCalendarDate = todayDate;
    var upVisits=[];
    var storedupVisits=[];
     if($scope.newWoman == false){
        var storedupVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.urineProtein;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.urineProtein};
            }).value();
         upVisits = getVisits(storedupVisits);    
         for(var i=0;i< upVisits.length ;i++){
            upVisits[i].value = (upVisits[i].value == 'yes'?'+':'-')
         } 
        $scope.visitDetails.upVisits = _.indexBy(upVisits, 'monthNo')
     }else{

     }  
    $scope.$watch(function(scope) {return $scope.UPCalendarDate},
        function() {
                if($scope.UPOutcome){
                    updateRowforVisits("upVisits",$scope.UPOutcome,$scope.UPCalendarDate);
                }
        }
    );
    $scope.updateUP=function(){
        if($scope.UPOutcome) {
                   updateRowforVisits("upVisits",$scope.UPOutcome,$scope.UPCalendarDate);
                }
    }

    
//LOGIC FOR Swelling
    $scope.SwellingCalendarDate = todayDate;
    var swellingVisits=[];
    var storedswellingVisits=[];
    if($scope.newWoman == false){
        var storedswellingVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.swelling;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.swelling};
            }).value();
        swellingVisits = getVisits(storedswellingVisits);    
        $scope.visitDetails.swellingVisits = _.indexBy(swellingVisits, 'monthNo')
    }else{

    }   
    $scope.$watch(function(scope) {return $scope.SwellingCalendarDate},
        function() {
                if($scope.SwellingOutcome){
                     updateRowforVisits("swellingVisits",$scope.SwellingOutcome,$scope.SwellingCalendarDate);
                }
        }
    );
    $scope.updateSwelling=function(){
        if($scope.SwellingOutcome) {
                  updateRowforVisits("swellingVisits",$scope.SwellingOutcome,$scope.SwellingCalendarDate);
        }
    }

    //LOGIC FOR Fits
    $scope.FitsCalendarDate = todayDate;
    var fitsVisits=[];
    var storedfitsVisits=[];
     if($scope.newWoman == false){
        var storedfitsVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.headache;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.headache};
            }).value();
         fitsVisits = getVisits(storedfitsVisits);    
        $scope.visitDetails.fitsVisits = _.indexBy(fitsVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.FitsCalendarDate},
        function() {
                if($scope.FitsOutcome){
                     updateRowforVisits("fitsVisits",$scope.FitsOutcome,$scope.FitsCalendarDate);
                }
        }
    );
    $scope.updateFits=function(){
        if($scope.FitsOutcome) {
                    updateRowforVisits("fitsVisits",$scope.FitsOutcome,$scope.FitsCalendarDate);
                }
    }

    //LOGIC FOR US
    $scope.USCalendarDate = todayDate;
    var usVisits=[];
    var storedusVisits=[];
     if($scope.newWoman == false){
        var storedusVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.urineSugar;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.urineSugar};
            }).value();
         usVisits = getVisits(storedusVisits);  
         for(var i=0;i< usVisits.length ;i++){
            usVisits[i].value = (usVisits[i].value == 'yes'?'+':'-')
         }  
        $scope.visitDetails.usVisits = _.indexBy(usVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.USCalendarDate},
        function() {
                if($scope.USOutcome){
                    updateRowforVisits("usVisits",$scope.USOutcome,$scope.USCalendarDate);
                }
        }
    );
    $scope.updateUS=function(){
        if($scope.USOutcome) {
                  updateRowforVisits("usVisits",$scope.USOutcome,$scope.USCalendarDate);
                }
    }

    //LOGIC FOR fever
    $scope.FeverCalendarDate = todayDate;
    var feverVisits=[];
    var storedfeverVisits=[];
     if($scope.newWoman == false){
        var storedfeverVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.fever;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.fever};
            }).value();
         feverVisits = getVisits(storedfeverVisits);   
         for(var i=0;i< feverVisits.length ;i++){
            feverVisits[i].value = (feverVisits[i].value == 'yes'?'+':'-')
         } 
        $scope.visitDetails.feverVisits = _.indexBy(feverVisits, 'monthNo')
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.FeverCalendarDate},
        function() {
                if($scope.FeverOutcome){
                    updateRowforVisits("feverVisits",$scope.FeverOutcome,$scope.FeverCalendarDate);
                }
        }
    );
    $scope.updateFever=function(){
        if($scope.FeverOutcome) {
                   updateRowforVisits("feverVisits",$scope.FeverOutcome,$scope.FeverCalendarDate);
                }
    }

    //LOGIC FOR Foulsmell
    $scope.FoulSmellCalendarDate = todayDate;
    var foulsmellVisits=[];
    var storedfoulsmellVisits=[];
     if($scope.newWoman == false){
        var storedfoulsmellVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.foulSmellingDischarge;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.foulSmellingDischarge};
            }).value();
         foulsmellVisits = getVisits(storedfoulsmellVisits);    
         for(var i=0;i< foulsmellVisits.length ;i++){
            foulsmellVisits[i].value = (foulsmellVisits[i].value == 'yes'?'+':'-')
         }
        $scope.visitDetails.foulsmellVisits = _.indexBy(foulsmellVisits, 'monthNo')
     }else{

     }    
    $scope.$watch(function(scope) {return $scope.FoulSmellCalendarDate},
        function() {
                if($scope.FoulSmellOutcome){
                    updateRowforVisits("foulsmellVisits",$scope.FoulSmellOutcome,$scope.FoulSmellCalendarDate);
                }
        }
    );
    $scope.updateFoulSmell=function(){
        if($scope.FoulSmellOutcome) {
                   updateRowforVisits("foulsmellVisits",$scope.FoulSmellOutcome,$scope.FoulSmellCalendarDate);
                }
    }

    //LOGIC FOR Weakness
    $scope.WeaknessCalendarDate = todayDate;
    var weaknessVisits=[];
    var storedweaknessVisits=[];
     if($scope.newWoman == false){
        var storedweaknessVisits =_.chain(womanData.ANC)
            .filter(function(e){ 
                return e.otherInfection;
            }).map(function(e) { 
            return {monthID: e.monthID, value: e.otherInfection};
            }).value();
         weaknessVisits = getVisits(storedweaknessVisits);    
         for(var i=0;i< weaknessVisits.length ;i++){
            weaknessVisits[i].value = (weaknessVisits[i].value == 'yes'?'+':'-')
         }
        $scope.visitDetails.weaknessVisits = _.indexBy(weaknessVisits, 'monthNo')
     }else{

     }    
    $scope.$watch(function(scope) {return $scope.WeaknessCalendarDate},
        function() {
                if($scope.WeaknessOutcome){
                   updateRowforVisits("weaknessVisits",$scope.WeaknessOutcome,$scope.WeaknessCalendarDate);
                }
        }
    );
    $scope.updateWeakness=function(){
        if($scope.WeaknessOutcome) {
                   updateRowforVisits("weaknessVisits",$scope.WeaknessOutcome,$scope.WeaknessCalendarDate);
                }
    }


     function updateRowforVisits(index,outcome,calendarDate){
        var currentValue,currentMonth,currentDate,currentYear;
        currentValue = outcome;
        currentDate = UtilityService.convertDateFormat(calendarDate);   
        currentYear = calendarDate.getFullYear();
        currentMonth = UtilityService.showMonthFromDate(currentDate);
        checkUpforPale(index,currentMonth,currentValue,currentYear);

     }

         //var VisitItem=["paleEyeVisits","nightBlindVisits"];
     function getVisits(storedVisits){
        var updatedVisits = [];
        for(var i=0;i< storedVisits.length;i++){
            for (var j=0;j < $scope.monthsArray.length;j++){
                if($scope.monthsArray[j].pregnancyMonthNo == storedVisits[i].monthID){
                    //return  $scope.visitDetails.PaleEyeVisits[i].value+" "+$scope.monthsArray[j].monthNo;
                    var visitObj={'monthNo':$scope.monthsArray[j].monthNo,'value':storedVisits[i].value,'pregnancyMonthNo':$scope.monthsArray[j].pregnancyMonthNo}
                    updatedVisits.push(visitObj);
                }
            }
        }
        return updatedVisits;
    }    
   
     function checkUp(symptomIndex, month, value,selectedyear){

             var selectedMonth = $scope.monthsArray.filter(function(e) {
                  return e.monthNo == month;
                });
                if( selectedMonth.length == 0 || selectedMonth.length == 1 && selectedyear !=  selectedMonth[0].monthYear){
                      $scope.symptomData[symptomIndex].month = 0;
                      $scope.symptomData[symptomIndex].pregnancyMonthNo = 0;
                }else{
                    $scope.symptomData[symptomIndex].month = month;
                    $scope.symptomData[symptomIndex].pregnancyMonthNo = selectedMonth[0].pregnancyMonthNo;
                }
            $scope.symptomData[symptomIndex].value = value;
    }
    $scope.matchArray={};
    $scope.lastObj={};
    function checkUpforPale(symptomIndex, month, value,selectedyear){

                var selectedMonth = $scope.monthsArray.filter(function(e) {
                  return e.monthNo == month;
                });
                if( selectedMonth.length == 0 || selectedMonth.length == 1 && selectedyear !=  selectedMonth[0].monthYear){
                    month=0;
                   $scope.lastObj[symptomIndex] = {'monthNo':0,'value':value,'pregnancyMonthNo': 0};
                }else{
                   $scope.lastObj[symptomIndex] = {'monthNo':month,'value':value,'pregnancyMonthNo': selectedMonth[0].pregnancyMonthNo};
                }
                $scope.matchArray[symptomIndex] = 0;

                for (var key in $scope.visitDetails[symptomIndex]) {
                   var obj = $scope.visitDetails[symptomIndex][key];
                   if(obj.monthNo == month){
                        $scope.matchArray[symptomIndex] = 1;
                        break;
                    }
                }
    }        
    //watch Dod    
    $scope.$watch(function(scope) {return $scope.DODCalendarDate},
        function() {
            if($scope.DODCalendarDate){
                $scope.FPMethod =-1;    
                $scope.dateOfDelivery = false;
                womanData.deliveryDate = $scope.DODCalendarDate;
            }
        }
    );
   
   //watching birthoutcome 
   $scope.birthGender={};
   $scope.birthGender.name="girl"
   $scope.selectBirthGender=function(gender){
       $scope.birthGender.name=gender;
    }
    $scope.FPMethod =-1;
    //LOGIC FOR sELECTING fp METHOD
    var familyPlanningMethods = familyPlanning.getFamilyPlanningMethods();

      $scope.selectFPMethod = function(methodID) {
         var filteredMethodList = familyPlanningMethods.filter(function(e) {
          return e.id === methodID;
        });
        $scope.FPMethod = filteredMethodList[0];
        womanData.FPMethod = filteredMethodList[0].name;
      };

    $scope.getDate=function(){
        var today=new Date();
        var currentMonth=today.getMonth()+1;
        var currentDay=today.getDate();
        var currentYear=today.getFullYear();
        return currentYear+"/"+currentMonth+"/"+currentDay;
    }
    $scope.format = 'dd/MM/yy';

    $scope.today = function() {
        //  $scope.ashaCalendarDate = $scope.getDate();
    }
    $scope.today();

    $scope.clear = function () {
        $scope.ashaCalendarDate = null;
    }


    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    }

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    }
    $scope.toggleMin();
    $scope.opened=false;
    $scope.openedANM=false;
    $scope.openedWeight=false;
    $scope.openedTT=false;
    $scope.openedHB = false;
    $scope.openedPale=false;
    $scope.openedNightBlind=false;
    $scope.openedBleeding=false;
    $scope.openedMalaria=false;//UPCalendarDate
    $scope.openedBP=false;//UPCalendarDate
    $scope.openedUP=false;//openedFits
    $scope.openedSwelling=false;
    $scope.openedFits=false;//openedUS
    $scope.openedUS=false;//openedUS
    $scope.openedFever=false;//openedUS
    $scope.openedFoulSmell=false;//openedUS
    $scope.openedWeakness=false;//openedUS
    $scope.openedEDD=false;//openedUS
    $scope.openedLMP=false;//openedUS openedDOD
    $scope.openedDOD=false;
    $scope.open = function($event,name) {
        $event.preventDefault();
        $event.stopPropagation();

        if(name == "asha"){
            $scope.opened = true;
        }else if(name == "anm"){
            $scope.openedANM = true;
        }else if(name == "weight"){
            $scope.openedWeight = true;
        }else if(name == "TT"){
            $scope.openedTT = true;
        }else if(name == "HB"){
            $scope.openedHB = true;
        }else if(name == "Pale"){
            $scope.openedPale = true;
        }else if(name == "IFA"){
            $scope.openedIFA = true;
        }else if(name == "NB"){
             $scope.openedNightBlind=true;
        }else if(name == "Bleeding"){
             $scope.openedBleeding=true;
        }else if(name == "Malaria"){
             $scope.openedMalaria=true;
        }else if(name == "BP"){
             $scope.openedBP=true;
        }else if(name == "UP"){
             $scope.openedUP=true;
        }else if(name == "Swelling"){
             $scope.openedSwelling=true;
        }else if(name == "Fits"){
             $scope.openedFits=true;
        }else if(name == "US"){
             $scope.openedUS=true;
        }else if(name == "Fever"){
             $scope.openedFever=true;
        }else if(name == "FoulSmell"){
             $scope.openedFoulSmell=true;
        }else if(name == "Weakness"){
             $scope.openedWeakness=true;
        }else if(name == "EDD"){
             $scope.openedEDD=true;
        }else if(name == "LMP"){
             $scope.openedLMP=true;
        }else if(name == "DOD"){
             $scope.openedDOD=true;
        }
    }

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    }
}
$scope.opened=false;
    $scope.openedANM=false;
    $scope.openedWeight=false;
    $scope.openedTT = false;
    $scope.openedHB = false;
    $scope.openedPale=false;
    $scope.openedNightBlind=false;
    $scope.openedBleeding=false;
    $scope.openedMalaria=false;//UPCalendarDate
    $scope.openedBP=false;//UPCalendarDate
    $scope.openedUP=false;//openedFits
    $scope.openedSwelling=false;
    $scope.openedFits=false;//openedUS
    $scope.openedUS=false;//openedUS
    $scope.openedFever=false;//openedUS
    $scope.openedFoulSmell=false;//openedUS
    $scope.openedWeakness=false;//openedUS
    $scope.openedEDD=false;//openedUS
    $scope.openedLMP=false;//openedUS openedDOD
    $scope.openedDOD=false;
    $scope.open = function($event,name) {
        $event.preventDefault();
        $event.stopPropagation();

        if(name == "asha"){
            $scope.opened = true;
        }else if(name == "anm"){
            $scope.openedANM = true;
        }else if(name == "weight"){
            $scope.openedWeight = true;
        }else if(name == "TT"){
            $scope.openedTT = true;
        }else if(name == "HB"){
            $scope.openedHB = true;
        }else if(name == "Pale"){
            $scope.openedPale = true;
        }else if(name == "IFA"){
            $scope.openedIFA = true;
        }else if(name == "NB"){
             $scope.openedNightBlind=true;
        }else if(name == "Bleeding"){
             $scope.openedBleeding=true;
        }else if(name == "Malaria"){
             $scope.openedMalaria=true;
        }else if(name == "BP"){
             $scope.openedBP=true;
        }else if(name == "UP"){
             $scope.openedUP=true;
        }else if(name == "Swelling"){
             $scope.openedSwelling=true;
        }else if(name == "Fits"){
             $scope.openedFits=true;
        }else if(name == "US"){
             $scope.openedUS=true;
        }else if(name == "Fever"){
             $scope.openedFever=true;
        }else if(name == "FoulSmell"){
             $scope.openedFoulSmell=true;
        }else if(name == "Weakness"){
             $scope.openedWeakness=true;
        }else if(name == "EDD"){
             $scope.openedEDD=true;
        }else if(name == "LMP"){
             $scope.openedLMP=true;
        }else if(name == "DOD"){
             $scope.openedDOD=true;
        }
    }


    $scope.noEDD = false;
    $scope.setEDD = function(){
        if($scope.LMPCalendarDate){
            $scope.noEDD = false;
            var LMPDate = $scope.LMPCalendarDate,
                isEligibleForEDD,
                currDate = new Date(),
                ineligibleDate;  //an edd is set only if lmp is 45 days before the current date
            if(LMPDate){
                ineligibleDate = UtilityService.addDaysToDate(LMPDate, 44);
                // if current date is equal to or greater than in eligible date then set edd after 40 weeks of LMP date
                isEligibleForEDD = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate()).getTime() - ineligibleDate.getTime() >= 0;
                if(isEligibleForEDD){
                    var EDDCalendarDate = UtilityService.addDaysToDate(LMPDate, 279);
                     $scope.EDDCalendarDate  =UtilityService.convertDateFormat(EDDCalendarDate);
                     $scope.LMPCalendarDate  =UtilityService.convertDateFormat(LMPDate);
                } else{
                    $scope.noEDD = true;
                }

            }
        }

    };
 //SETMAX EDD
    var today=new Date();
    var maxEdd = UtilityService.addDaysToDate(today, 235);
    $scope.maxEDD = UtilityService.setMaxMinDate(maxEdd);

 //SETMIN EDD   
    $scope.minEDD = UtilityService.setMaxMinDate(today);

//SET LMP based on EDD
    $scope.setLMP = function(){
        if($scope.EDDCalendarDate){
            var EDDDate = $scope.EDDCalendarDate,
            //isEligibleForEDD,
                currDate = new Date();  //an edd is set only if lmp is 45 days before the current date
                    console.log("edd"+ EDDDate);
            if(EDDDate){
                var LMPCalendarDate = UtilityService.subtractDaysFromDate(EDDDate, 279);
                $scope.LMPCalendarDate  =UtilityService.convertDateFormat(LMPCalendarDate);
                $scope.EDDCalendarDate =UtilityService.convertDateFormat($scope.EDDCalendarDate);
            }
        }
    }
    //go to new born
     var childObj = {};
    $scope.gotoNewBorn=function(){
         var childDisplayID = childObj.displayID;
         UtilityService.setChildDisplayID(childDisplayID).then(function(success){
            $state.go('newborn');
        },function(error){})
    }

        //save button functionality
     $scope.visitDetailss={}
     $scope.saveANCDetails =function(){
        var VisitItem=["paleEyeVisits","nightBlindVisits","ashaVisits","anmVisits","wtVisits","hbVisits","malariaVisits","bleedingVisits","upVisits","swellingVisits","fitsVisits","usVisits","feverVisits","foulsmellVisits","weaknessVisits","BPVisits","IFAVisits","TTVisits"];
        for(var i=0;i<18;i++){  //if there is an entry
            if( $scope.lastObj[VisitItem[i]] != undefined){
                if( $scope.visitDetails[VisitItem[i]] != undefined){
                    if($scope.matchArray[VisitItem[i]] == 1){
                    //if there is a value mismatch..then update it
                        $scope.visitDetails[VisitItem[i]][$scope.lastObj[VisitItem[i]].monthNo].value=$scope.lastObj[VisitItem[i]].value;
                    }else{  //if there is a new entry
                        $scope.visitDetails[VisitItem[i]][$scope.lastObj[VisitItem[i]].monthNo]=$scope.lastObj[VisitItem[i]];
                        $scope.matchArray[VisitItem[i]]=1;
                    }
                }else{  
                        var visits =[];
                        visits.push($scope.lastObj[VisitItem[i]]);
                        $scope.matchArray[VisitItem[i]]=1;
                        $scope.visitDetails[VisitItem[i]] =visits;
                        $scope.visitDetailss[VisitItem[i]] =  _.indexBy(visits, 'pregnancyMonthNo') 
                }
            }
             $scope.visitDetailss[VisitItem[i]] =  _.indexBy($scope.visitDetails[VisitItem[i]], 'pregnancyMonthNo') 
        }
        var ANC =[];
        var monthID, ASHAVisit,ANMVisit,weight,TT,HB,paleEye,bleeding,malaria,IFATablets,BP,swelling,headache,urineProtein,urineSugar,nightBlindness,foulSmellingDischarge,fever,otherInfection,lastUpdateDateTime;
        

        for(var i=0;i<=9;i++){ 
            monthID = i;
            if($scope.visitDetailss.ashaVisits[i] !=  undefined){
                ASHAVisit = $scope.visitDetailss.ashaVisits[i].value;
            }else{
                ASHAVisit = null;
            }
            if($scope.visitDetailss.anmVisits[i] !=  undefined){
                ANMVisit = $scope.visitDetailss.anmVisits[i].value;
            }else{
                ANMVisit = null;
            }
            if($scope.visitDetailss.wtVisits[i] !=  undefined){     //for weight
                 weight = $scope.visitDetailss.wtVisits[i].value
            }else{
                weight = null;
            }
             if($scope.visitDetailss.TTVisits[i] !=  undefined){
                TT = $scope.visitDetailss.TTVisits[i].value
            }else{
                TT = null;
            }
             if($scope.visitDetailss.IFAVisits[i] !=  undefined){
                IFATablets = $scope.visitDetailss.IFAVisits[i].value
            }else{
                IFATablets = null;
            }
            if( $scope.visitDetailss.paleEyeVisits[i] !=  undefined){     //for pale eye
                    paleEye = $scope.visitDetailss.paleEyeVisits[i].value;
            }else{
                paleEye = null;
            }
            if($scope.visitDetailss.nightBlindVisits[i] != undefined){     //for night blind
                 nightBlindness = $scope.visitDetailss.nightBlindVisits[i].value;
            }else{
                 nightBlindness = null;
            }
            if($scope.visitDetailss.hbVisits[i] != undefined){     //for night blind
                 HB = $scope.visitDetailss.hbVisits[i].value;
            }else{
                 HB = null;
            }
            if($scope.visitDetailss.bleedingVisits[i] != undefined){     //for night blind
                 bleeding = $scope.visitDetailss.bleedingVisits[i].value;
            }else{
                 bleeding = null;
            }
            if($scope.visitDetailss.malariaVisits[i] != undefined){     //for night blind
                 malaria = $scope.visitDetailss.malariaVisits[i].value;
            }else{
                 malaria = null;
            }     
            if($scope.visitDetailss.upVisits[i] != undefined){     //for pale eye
                 urineProtein = ($scope.visitDetailss.upVisits[i].value == "+"?'yes':'no');
            }else{
                 urineProtein = null;
            }
            if($scope.visitDetailss.swellingVisits[i] != undefined){     //for night blind
                 swelling =  $scope.visitDetailss.swellingVisits[i].value;
            }else{
                 swelling = null;
            }
            if($scope.visitDetailss.fitsVisits[i] != undefined){     //for fits
                 headache =  $scope.visitDetailss.fitsVisits[i].value;
            }else{
                 headache = null;
            }
            if($scope.visitDetailss.usVisits[i] != undefined){     //for pale eye
                 urineSugar =  ($scope.visitDetailss.usVisits[i].value  == "+"?'yes':'no');
            }else{
                 urineSugar = null;
            }
            if($scope.visitDetailss.foulsmellVisits[i] != undefined){     //for night blind
                 foulSmellingDischarge = ($scope.visitDetailss.foulsmellVisits[i].value  == "+"?'yes':'no');
            }else{
                 foulSmellingDischarge = null;
            }
            if($scope.visitDetailss.feverVisits[i] != undefined){     //for fits
                 fever = ($scope.visitDetailss.feverVisits[i].value== "+"?'yes':'no');
            }else{
                 fever = null;
            }
            if($scope.visitDetailss.weaknessVisits[i] != undefined){     //for fits
                 otherInfection = ($scope.visitDetailss.weaknessVisits[i].value == "+"?'yes':'no');
            }else{
                 otherInfection = null;
            }
            if($scope.visitDetailss.BPVisits[i] != undefined){     //for fits
                 BP = $scope.visitDetailss.BPVisits[i].value;
            }else{
                 BP = null;
            }
            ANC.push({'monthID':monthID,'ASHAVisit':ASHAVisit,'ANMVisit':ANMVisit,'weight':weight,'TT':TT,'HB':HB,'paleEye':paleEye,'bleeding':bleeding,'malaria':malaria,'IFATablets':IFATablets,'BP':BP,'swelling':swelling,'headache':headache,'urineProtein':urineProtein,'urineSugar':urineSugar,'nightBlindness':nightBlindness,'foulSmellingDischarge':foulSmellingDischarge,'fever':fever,'otherInfection':otherInfection,'lastUpdateDateTime':otherInfection});
        }
        womanData.ANC=ANC;
        if($scope.DODCalendarDate){
            if($scope.MaternalOutcome  && $scope.BirthOutcome ){
                womanData.maternalOutcome = $scope.MaternalOutcome;
                womanData.birthOutcome = $scope.BirthOutcome;
                //$scope.birthGender.name="girl"
                if($scope.BirthOutcome == "LiveBirth"){
                    childObj.motherID = womanData.womanID;
                    childObj.motherDisplayID= womanData.displayID;
                    childObj.motherName = womanData.name;
                    childObj.fatherName = womanData.husbandName;
                    childObj.phone = womanData.phone;
                    childObj.house =womanData.house;
                    childObj.gender = $scope.birthGender.name;
                    childObj.dob = UtilityService.convertDateFormat($scope.DODCalendarDate);
                    var childID = ChildService.addNewChild(childObj);
                    $scope.disableNewBorn = false;
                }
                WomanService.updateWomanDetails(womanData);
                //call child service   $scope.birthGender.name  
            }else if($scope.MaternalOutcome == undefined){
                alert("please select maternal outcome");    
            }else if($scope.BirthOutcome == undefined){
                alert("please select birth outcome");
            }
        }else{
              WomanService.updateWomanDetails(womanData);
                //call child service
        }
    }
});
