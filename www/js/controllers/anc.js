angular.module('uhiApp.controllers')
.controller('AncController', function($scope,$timeout,UtilityService,familyPlanning,videos,WomanService,$location) {
  var womanDisplayID = UtilityService.getWomanDisplayID();
    var womanData = WomanService.getWomanDetails(womanDisplayID);
    var womanData1 = { "womanID": "0121230250012001", // city+slum+worker+house+woman
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
//"LMP":'2/12/2015',
  //      "EDD":'2/10/2015',
        "LMP":null,
        "EDD":null,
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
    var lastAshaVistMonth,lastAshaVistDate,lastANMVistMonth,lastANMVistDate;
    var  ashaCountTotal=0;
    var ANMCountTotal=0;
    var pregnancyMonthNoArray=[];
    var monthNo,LMP,EDD,currentMonth;
    $scope.dateOfDelivery=true;
    $scope.enterButton = false;
    $scope.pregWomanExist=true;
    $scope.disableButton=false;
    $scope.pregWomanName= womanData.name;
    $scope.ancDOB = womanData.dob;
    $scope.ancAge =womanData.age;
    $scope.newWoman=false;

    $scope.enterPregnantWomanDetails=function(){
        if($scope.LMPCalendarDate && $scope.EDDCalendarDate){
              $scope.pregWomanExist=true;
              $scope.newWoman=true;
              showPregDetails($scope.LMPCalendarDate,$scope.EDDCalendarDate);
        }
     }
     //check for whther the woman has prgnant details or she is a new woman
    if(womanData.LMP == null || womanData.EDD == null ){           //a new woamn
        $scope.enterButton=true;
        $scope.pregWomanExist=false;
      
        // showPregDetails(LMP,EDD);
    }else{
        var LMP =  womanData.LMP; // 9/2/2015
        var EDD = womanData.EDD;
        calcPastTime(EDD);
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
  // $scope.monthsArray.push({'monthNo':-1});
    for(var i = 0; i <9;i++){
        if(monthNo == 13){         //MOVE TO JANUARY
            monthNo = 1;
        }
        var monthName = UtilityService.showMonth(monthNo);
        var month={'monthNo':monthNo,'monthName':monthName,'pregnancyMonthNo':i+1,'monthYear':0};
        $scope.monthsArray.push(month);
        monthNo++;

    }
    for (i=8;i>=0;i--){
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
    if(currentMonth == $scope.monthsArray[7].monthNo){ //if the current month is the 8th month
        $scope.FPmonth1=0;
        $scope.FPmonth2 = currentMonth;
        $scope.FPmonth3 = currentMonth+1;       
    }else if(currentMonth == $scope.monthsArray[8].monthNo){
    ////if the current month is the 9th month
        $scope.FPmonth1=0;
        $scope.FPmonth2 = 0;
        $scope.FPmonth3 = currentMonth;       
    }else{
        $scope.FPmonth1=$scope.monthsArray[6].monthNo;
        $scope.FPmonth2 = $scope.monthsArray[7].monthNo;
        $scope.FPmonth3 = $scope.monthsArray[8].monthNo;       
    }
    //logic for asha visit and ANMVisit
    $scope.ashaCalendarDate = todayDate; //set the calendar date to today
    if($scope.newWoman == false){
        angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.ASHAVisit != null){console.log("in");
            ashaCountTotal++;
            console.log(ANCObj.ASHAVisit);
            AshaVisitArray.push(ANCObj.ASHAVisit);
            lastAshaVistDate = AshaVisitArray[AshaVisitArray.length-1];
            lastAshaVistMonth = UtilityService.showMonthFromDate(lastAshaVistDate);
            console.log(lastAshaVistMonth);
        }
        })
        $scope.lastAshaVistDate = (lastAshaVistDate == undefined ?'': lastAshaVistDate);
        $scope.lastAshaVistMonth = (lastAshaVistMonth == undefined?'':lastAshaVistMonth);
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
    
  /*  $scope.lastAshaVistDate = _.chain(womanData.ANC)
        .pluck('ANMVisit')
        .sortBy(function(e) {
            return new Date(e);
        })
        .last()
        .value();
    */    
    console.log( $scope.ashaCalendarDate);
    $scope.ashaCountTotal = ashaCountTotal;
    var ashaInitializing = true;
    $scope.$watch(function(scope) {return $scope.ashaCalendarDate},
        function() {
            if (ashaInitializing) {
                $timeout(function() { ashaInitializing = false; });
            } else {
                // do whatever you were going to do
                console.log("asha calendar"+$scope.ashaCalendarDate);
                if(localStorage.getItem("count") == undefined){
                    $scope.ashaCountTotal ++;
                    localStorage.setItem("count",1);
                }
               // var diff = UtilityService.calcDiffDates(pastYrTime,$scope.ashaCalendarDate);
                var ashaCalendarDate = UtilityService.convertDateFormat($scope.ashaCalendarDate);
                var ashaCalendarMonth = UtilityService.showMonthFromDate(ashaCalendarDate);
                var ashaCalendarYear = $scope.ashaCalendarDate.getFullYear();
                //case when past mon is not the same as current month
                var selectedMonth = $scope.monthsArray.filter(function(e) {
                  return e.monthNo == ashaCalendarMonth;
                });
                if( selectedMonth.length == 0 || selectedMonth.length == 1 && ashaCalendarYear !=  selectedMonth[0].monthYear){
                     $scope.lastAshaVistMonth = -1;
                }else{
                    $scope.lastAshaVistMonth = ashaCalendarMonth;
                }
                $scope.lastAshaVistDate =ashaCalendarDate;
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
    // if(currentMonth != )
    $scope.ANMCalendarDate=todayDate;
    if($scope.newWoman == false){
        angular.forEach(womanData.ANC, function(ANCObj, index){
            if(ANCObj.ANMVisit != null){console.log("in");
                ANMCountTotal++;
                lastANMVisitDate= ANCObj.ANMVisit;
                lastANMVistMonth = UtilityService.showMonthFromDate(lastANMVisitDate);
                console.log(lastANMVistMonth);
            }
        })
        $scope.lastANMVisitDate = (lastANMVisitDate == undefined ?'': lastANMVisitDate);
        $scope.lastANMVistMonth = (lastANMVistMonth == undefined?'':lastANMVistMonth);

        if($scope.lastANMVistMonth == currentMonth){
            if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
                if(currentMonth == 12){
                    $scope.nextANMVisitMonth = 1; 
                }else{
                    $scope.nextANMVisitMonth = currentMonth + 1;  
                }                  //   checked
            }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
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
            if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                    $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                    $scope.nextANMVisitMonth = 2;
                }else{
                    $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                }
            }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
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
    // var month={'monthNo':
    var ANMInitializing = true;
    
    $scope.ANMCountTotal = ANMCountTotal;
    $scope.$watch(function(scope) {return $scope.ANMCalendarDate},
        function() {
            if (ANMInitializing) {
                $timeout(function() { ANMInitializing = false; });
            } else {
                // do whatever you were going to do
                //console.log($scope.ashaCalendarDate);
                if(localStorage.getItem("ANMCount") == undefined){
                    $scope.ANMCountTotal ++;
                    localStorage.setItem("ANMCount",1);
                }
                var ANMCalendarDate = UtilityService.convertDateFormat($scope.ANMCalendarDate);
                var ANMCalendarMonth = UtilityService.showMonthFromDate(ANMCalendarDate);
                var ANMCalendarYear = $scope.ANMCalendarDate.getFullYear();
                //case when past mon is not the same as current month
                 var selectedMonth = $scope.monthsArray.filter(function(e) {
                  return e.monthNo == ANMCalendarMonth;
                });
                if( selectedMonth.length == 0 || selectedMonth.length == 1 && ANMCalendarYear !=  selectedMonth[0].monthYear){
                     $scope.lastANMVistMonth = -1;
                }else{
                    $scope.lastANMVistMonth = ANMCalendarMonth;
                }
                $scope.lastANMVisitDate = ANMCalendarDate;

                //if calendar month is equal to current month
                if($scope.lastANMVistMonth == currentMonth){
                    if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
                        if(currentMonth == 12){
                            $scope.nextANMVisitMonth = 1; 
                        }else{
                            $scope.nextANMVisitMonth = currentMonth + 1;  
                        }                  //   checked
                    }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
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
                    if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                        if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                            $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                        }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                            $scope.nextANMVisitMonth = 2;
                        }else{
                            $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                        }
                    }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
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
    var WeightArray=[];
    var WeightDateArray=[];
    var lastWeightDate,lastWeightMonth,lastWeight;
    var lastWtObject ={};
    $scope.WeightCalendarDate=todayDate;
    if($scope.newWoman == false){
        lastWtObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.monthID, value: e.weight};
            })
            .filter(function(e){ 
                return e.value;
            })
            .sortBy('month')
            .last()
            .value();
        if(lastWtObject.value < 40){
            $scope.weightAlert = true;
        }
     } else{
        lastWtObject.value =0;
     } 
    $scope.$watch(function(scope) {return $scope.WeightCalendarDate},
        function() {
                if($scope.enteredWeight){
                    var currentWt = $scope.enteredWeight;
                    var currentWtDate = UtilityService.convertDateFormat($scope.WeightCalendarDate);
                    var currentWtMonth = UtilityService.showMonthFromDate(currentWtDate);
                    $scope.lastWeightDate =currentWtDate;
                    if(currentWt < 40){
                        $scope.weightAlert = true;
                    }else{
                        //if the current month is 1st 2nd or 3rd and wt is not less than 40  ..then no need to check
                        if(currentWtMonth ==  $scope.monthsArray[0].monthNo || currentWtMonth ==  $scope.monthsArray[1].monthNo || currentWtMonth ==  $scope.monthsArray[2].monthNo){
                        }else{
                            //if the current month is  other than 1st 2nd or 3rd and wt is not less than 40  ..then check if its less than last wt..
                            if(currentWt < lastWtObject.value ){
                                $scope.weightAlert = true;
                            }
                        }
                    }
                    updateRow(4);
                }
        }
    );
    $scope.updateWeight=function(){
        if(isNaN($scope.enteredWeight) == false){
                    var currentWt = $scope.enteredWeight;
                    var currentWtDate = UtilityService.convertDateFormat($scope.WeightCalendarDate);
                    var currentWtMonth = UtilityService.showMonthFromDate(currentWtDate);
                    $scope.lastWeightDate =currentWtDate;
                    if(currentWt < 40){
                        $scope.weightAlert = true;
                    }else{
                        //if the current month is 1st 2nd or 3rd and wt is not less than 40  ..then no need to check
                        if(currentWtMonth ==  $scope.monthsArray[0].monthNo || currentWtMonth ==  $scope.monthsArray[1].monthNo || currentWtMonth ==  $scope.monthsArray[2].monthNo){
                        }else{
                            //if the current month is  other than 1st 2nd or 3rd and wt is not less than 40  ..then check if its less than last wt..
                            if(currentWt < lastWtObject.value ){
                                $scope.weightAlert = true;
                            }
                        }
                    }
                    updateRow(4);
                }

    }


    //LOGIC FOR Malaria
    $scope.MalariaCalendarDate = todayDate;
    var lastMalariaObject={};
    if($scope.newWoman == false){
     lastMalariaObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.Malaria};
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
                    updateRow(5);
                }
        }
    );
    $scope.updateMalaria=function(){
        if($scope.malariaOutcome) {
                   updateRow(5);
                }
    }


//LOGIC FOR TT
  // $scope.enteredTT = lastPregnancyTTCount;
//need to apply the loop as a the last anc object can be empty for HB
    $scope.TTCalendarDate = todayDate;
    var totalTTCount =0;
    var lastTTCount=0,lastTTObject,lastTTMonth;
    var lastPregnancyTTCount=0;
     var extraCount=0;
    if($scope.newWoman == false){
        angular.forEach(womanData.ANC, function(ANCObj, index){
            if(ANCObj.TT != null){console.log("in");
                totalTTCount=parseInt(totalTTCount) + parseInt(ANCObj.TT);
            }
        })
        lastTTObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.monthID, value: e.TT};
            })
            .filter(function(e){ 
                return e.value;
            })
            .sortBy('month')
            .last()
            .value();
        lastTTMonth = $scope.monthsArray[lastTTObject.month-1].monthNo;
        lastTTCount = lastTTObject.value;
        $scope.lastTTCount = lastTTCount;
       // $scope.lastPregnancyTTMonth = lastPregnancyTTMonth;
        if(totalTTCount >=2){
            $scope.nextTTMonth=0;
            $scope.alertTT= false;
        }else if(totalTTCount == 1 || totalTTCount == 0){
            if($scope.lastTTMonth == currentMonth){
                if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
                    if(currentMonth == 12){
                        $scope.nextTTMonth = 1; 
                    }else{
                        $scope.nextTTMonth = currentMonth + 1;  
                    }                  //   checked
                }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
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
                if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                        $scope.nextTTMonth = 2;
                    }else{
                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                    }
                }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
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
            $scope.nextTTMonth = currentMonth;
            $scope.lastTTCount='';
            $scope.alertTT = true;
    }
     $scope.totalTTCount = totalTTCount;
    var finalCount=totalTTCount;
    var TTInitializing =true;
    $scope.$watch(function(scope) {return $scope.TTCalendarDate},
        function() {
                if (TTInitializing) {
                $timeout(function() { TTInitializing = false; });
                } else {
                    totalTTCount=finalCount+1;
                    lastTTCount=1;
                    var TTCalendarDate = UtilityService.convertDateFormat($scope.TTCalendarDate);
                    var TTCalendaMonth = UtilityService.showMonthFromDate(TTCalendarDate);
                    var TTCalendarYear = $scope.TTCalendarDate.getFullYear();
                //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == TTCalendaMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && TTCalendarYear !=  selectedMonth[0].monthYear){
                         $scope.lastTTMonth = -1;
                    }else{
                        $scope.lastTTMonth = TTCalendaMonth;
                    }
                    $scope.lastTTDate = TTCalendarDate;  
                    $scope.enteredTT = ( $scope.enteredTT == undefined ? 0:$scope.enteredTT);
                    var enteredTT=$scope.enteredTT;
                       if(totalTTCount >=2){         //if the total tt in current preg is 2 or more..no need for more
                            $scope.nextTTMonth=0;
                            $scope.alertTT= false;
                        }else if(totalTTCount == 1  && enteredTT < 1 || totalTTCount == 0){ //if total is 0...then must
                            if($scope.lastTTMonth == currentMonth){                         //if the total is 1..then in previous 1  then no else must
                                if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                  //   checked
                                }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
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
                                if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                                    }
                                }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
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
                    $scope.lastTTCount = lastTTCount;
             }       
        }
    );

   $scope.updateTT=function(){
                    totalTTCount=finalCount+1;
                    lastTTCount=1;
                    var TTCalendarDate = UtilityService.convertDateFormat($scope.TTCalendarDate);
                    var TTCalendaMonth = UtilityService.showMonthFromDate(TTCalendarDate);
                    var TTCalendarYear = $scope.TTCalendarDate.getFullYear();
                    //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == TTCalendaMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && TTCalendarYear !=  selectedMonth[0].monthYear){
                         $scope.lastTTMonth = -1;
                    }else{
                        $scope.lastTTMonth = TTCalendaMonth;
                    }
                    $scope.lastTTDate = TTCalendarDate;  
                    $scope.enteredTT = ( $scope.enteredTT == undefined ? 0:$scope.enteredTT);
                    var enteredTT=$scope.enteredTT;
                       if(totalTTCount >=2){         //if the total tt in current preg is 2 or more..no need for more
                            $scope.nextTTMonth=0;
                            $scope.alertTT= false;
                        }else if(totalTTCount == 1  && enteredTT < 1 || totalTTCount == 0){ //if total is 0...then must
                            if($scope.lastTTMonth == currentMonth){                         //if the total is 1..then in previous 1  then no else must
                                if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
                                    if(currentMonth == 12){
                                        $scope.nextTTMonth = 1; 
                                    }else{
                                        $scope.nextTTMonth = currentMonth + 1;  
                                    }                  //   checked
                                }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
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
                                if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                                    if($scope.lastTTMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                                        $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                                    }else if($scope.lastANMVistMonth == 12 &&  currentMonth == 1){
                                        $scope.nextTTMonth = 2;
                                    }else{
                                        $scope.nextTTMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
                                    }
                                }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
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
                    $scope.lastTTCount = lastTTCount;


   }

//LOGIC FOR ANAEMIA
    $scope.HBCalendarDate=todayDate;
     var lastHBObject={};
     if($scope.newWoman == false){
        lastHBObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.monthID, value: e.HB};
            })
            .filter(function(e){ 
                return e.value;
            })
            .sortBy('month')
            .last()
            .value();
        if(lastHBObject.value < 10){
            $scope.alertHB = true;
        }
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.HBCalendarDate},
        function() {
                if(isNaN($scope.enteredHB)== false){
                    var currentHB = $scope.enteredHB;
                    if(currentHB < 10){
                        $scope.alertHB = true;
                    }else{
                        $scope.alertHB = false;
                    }
                    updateRow(2);
                }
        }
    );
    $scope.updateHB=function(){
        var enteredHB = $scope.enteredHB;
            if(isNaN(enteredHB) == false){
                var currentHB = enteredHB;
                if(currentHB < 10){
                    $scope.alertHB = true;
                }else{
                    $scope.alertHB = false;
                }
                updateRow(2);
            }


    }  
//LOGIC FOR Pale Eye
    $scope.PaleCalendarDate = todayDate;
    var lastPaleEyeObject={};
     if($scope.newWoman == false){
     lastPaleEyeObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.paleEye};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.PaleCalendarDate},
        function() {
                if($scope.paleOutcome){
                    updateRow(0);
                }
        }
    );
    $scope.updatePale=function(){
        if($scope.paleOutcome) {
                   updateRow(0);
                }
    }

    //LOGIC FOR Night Blindness
    $scope.NightBlindCalendarDate = todayDate;
    var lastNightBlindObject={};
     if($scope.newWoman == false){
        lastNightBlindObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.nightBlindness};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }
    $scope.$watch(function(scope) {return $scope.NightBlindCalendarDate},
        function() {
                if($scope.blindOutcome){
                    updateRow(1);
                }
        }
    );
    $scope.updateBlind=function(){
        if($scope.blindOutcome) {
                   updateRow(1);
                }
    }

    //LOGIC FOR Bleeding
    $scope.BleedingCalendarDate = todayDate;
    var lastBleedingObject={};
     if($scope.newWoman == false){
      lastBleedingObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.bleeding};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{
       
     }   
    $scope.$watch(function(scope) {return $scope.BleedingCalendarDate},
        function() {
                if($scope.bleedingOutcome){
                    updateRow(3);
                }
        }
    );
    $scope.updateBleed=function(){
        if($scope.bleedingOutcome) {
                   updateRow(3);
                }
    }

    //LOGIC FOR Malaria
    $scope.MalariaCalendarDate = todayDate;
    var lastMalariaObject={};
    if($scope.newWoman == false){
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
                    updateRow(5);
                }
        }
    );
    $scope.updateMalaria=function(){
        if($scope.malariaOutcome) {
                   updateRow(5);
                }
    }


//LOGIC FOR IFA Tab;lets
    $scope.IFACalendarDate = todayDate;
    var lastIFAValue,lastIFADate;
    var IFAArray=[];
    var IFADateArray=[];
    var totalIFACount =0;
    var lastIFACount=0;
    var lastIFAObject={};
//need to apply the loop as a the last anc object can be empty for HB
    if($scope.newWoman == false){
        angular.forEach(womanData.ANC, function(ANCObj, index){
            if(ANCObj.IFATablets != null){console.log("in");
                totalIFACount=parseInt(totalIFACount) + parseInt(ANCObj.IFATablets);
            }
        })
         lastIFAObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.monthID, value: e.IFATablets};
            })
            .filter(function(e){ 
                return e.value;
            })
            .sortBy('month')
            .last()
            .value();
        var lastPregnancyIFAMonth=   $scope.monthsArray[lastIFAObject.month-1].monthNo;      
        lastIFACount=lastIFAObject.value;
        $scope.lastPregnancyIFAMonth=lastPregnancyIFAMonth;
        if(totalIFACount <= 100){
            if(lastPregnancyIFAMonth == currentMonth){
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
      $scope.lastIFACount=lastIFACount;
      $scope.totalIFACount=totalIFACount;
    $scope.$watch(function(scope) {return $scope.IFACalendarDate},
        function() {
                if($scope.enteredIFA){
                    var currentIFA = $scope.enteredIFA;
                    totalIFACount = parseInt(totalIFACount) + parseInt(currentIFA);
                    var lastPregnancyIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastPregnancyIFAMonth = UtilityService.showMonthFromDate(lastPregnancyIFADate);
                    var lastPregnancyIFAYear = $scope.ANMCalendarDate.getFullYear();
                    //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == lastPregnancyIFAMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && lastPregnancyIFAYear !=  selectedMonth[0].monthYear){
                         $scope.lastPregnancyIFAMonth = -1;
                    }else{
                        $scope.lastPregnancyIFAMonth = lastPregnancyIFAMonth;
                    }
                    $scope.lastPregnancyIFADate =lastPregnancyIFADate;
                    if(totalIFACount <= 100){
                        if(lastPregnancyIFAMonth == currentMonth){
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
                    $scope.totalIFACount=totalIFACount;
                    $scope.lastIFACount=currentIFA;

                }
        }
    );
    $scope.updateIFA=function(){
         if(isNaN($scope.enteredIFA) == false){
                    var currentIFA = $scope.enteredIFA;
                    totalIFACount = parseInt(totalIFACount) + parseInt(currentIFA);
                    var lastPregnancyIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastPregnancyIFAMonth = UtilityService.showMonthFromDate(lastPregnancyIFADate);
                    var lastPregnancyIFAYear = $scope.ANMCalendarDate.getFullYear();
                    //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == lastPregnancyIFAMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && lastPregnancyIFAYear !=  selectedMonth[0].monthYear){
                         $scope.lastPregnancyIFAMonth = -1;
                    }else{
                        $scope.lastPregnancyIFAMonth = lastPregnancyIFAMonth;
                    }
                    $scope.lastPregnancyIFADate =lastPregnancyIFADate;
                    if(totalIFACount <= 100){
                        if(lastPregnancyIFAMonth == currentMonth){
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
                    $scope.totalIFACount=totalIFACount;
                    $scope.lastIFACount=currentIFA;

                }


    }

 //LOGIC FOR BP
    $scope.BPCalendarDate = todayDate;
    var lastBPObject={};
    if($scope.newWoman == false){
     lastBPObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.BP};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.BPCalendarDate},
        function() {
                if($scope.BPOutcome){
                    updateRow(13);
                }
        }
    );
    $scope.updateBP=function(){
        if($scope.BPOutcome) {
                   updateRow(13);
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
            updateRow(13);
        }
            
    }
 
//LOGIC FOR UP
    $scope.UPCalendarDate = todayDate;
     var lastUPObject={};
    if($scope.newWoman == false){
     lastUPObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.urineProtein};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.UPCalendarDate},
        function() {
                if($scope.UPOutcome){
                    updateRow(6);
                }
        }
    );
    $scope.updateUP=function(){
        if($scope.UPOutcome) {
                   updateRow(6);
                }
    }

    
//LOGIC FOR Swelling
    $scope.SwellingCalendarDate = todayDate;
    var lastSwellingObject={};
    if($scope.newWoman == false){
     lastSwellingObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.swelling};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
    }else{

    }    
    $scope.$watch(function(scope) {return $scope.SwellingCalendarDate},
        function() {
                if($scope.SwellingOutcome){
                    updateRow(7);
                }
        }
    );
    $scope.updateSwelling=function(){
        if($scope.SwellingOutcome) {
                 updateRow(7);
                }
    }

    //LOGIC FOR Fits
    $scope.FitsCalendarDate = todayDate;
    var lastFitsObject={};
    if($scope.newWoman == false){
     lastFitsObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.headache};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.FitsCalendarDate},
        function() {
                if($scope.FitsOutcome){
                    updateRow(8);
                }
        }
    );
    $scope.updateFits=function(){
        if($scope.FitsOutcome) {
                   updateRow(8);
                }
    }
    /*"UrineSugar":"yes",
            "NightBlindness":'yes',
            "FoulSmellingDischarge":"yes",
            "Fever":"yes",
            "OtherInfection":"yes",*/

    //LOGIC FOR US
    $scope.USCalendarDate = todayDate;
    var lastUSObject={};
    if($scope.newWoman == false){
        lastUSObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.urineSugar};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

     }   
    $scope.$watch(function(scope) {return $scope.USCalendarDate},
        function() {
                if($scope.USOutcome){
                    updateRow(9);
                }
        }
    );
    $scope.updateUS=function(){
        if($scope.USOutcome) {
                   updateRow(9);
                }
    }

    //LOGIC FOR fever
    $scope.FeverCalendarDate = todayDate;
     var lastFeverObject={};
    if($scope.newWoman == false){
     lastFeverObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.fever};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
    }else{

    }    
    $scope.$watch(function(scope) {return $scope.FeverCalendarDate},
        function() {
                if($scope.FeverOutcome){
                    updateRow(10);
                }
        }
    );
    $scope.updateFever=function(){
        if($scope.FeverOutcome) {
                   updateRow(10);
                }
    }

    //LOGIC FOR Foulsmell
    $scope.FoulSmellCalendarDate = todayDate;
    var lastFoulSmellObject={};
    if($scope.newWoman == false){
         lastFoulSmellObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.foulSmellingDischarge};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
    }else{

    }    
    
    $scope.$watch(function(scope) {return $scope.FoulSmellCalendarDate},
        function() {
                if($scope.FoulSmellOutcome){
                    updateRow(11);
                }
        }
    );
    $scope.updateFoulSmell=function(){
        if($scope.FoulSmellOutcome) {
                   updateRow(11);
                }
    }

    //LOGIC FOR Weakness
    $scope.WeaknessCalendarDate = todayDate;
    var weaknessObject={};
     if($scope.newWoman == false){
      weaknessObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.monthID, value: e.otherInfection};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
     }else{

    }    
    $scope.$watch(function(scope) {return $scope.WeaknessCalendarDate},
        function() {
                if($scope.WeaknessOutcome){
                    updateRow(12);
                }
        }
    );
    $scope.updateWeakness=function(){
        if($scope.WeaknessOutcome) {
                   updateRow(12);
                }
    }


     function updateRow(index) {
        var currentValue,currentMonth,currentDate;
        if(index == 0){  //pale 0
            currentValue= $scope.paleOutcome;
            currentDate= UtilityService.convertDateFormat($scope.PaleCalendarDate);
            currentYear= $scope.PaleCalendarDate.getFullYear();
        }else if(index == 1){
            currentValue= $scope.blindOutcome;
            currentDate= UtilityService.convertDateFormat($scope.NightBlindCalendarDate);
            currentYear= $scope.NightBlindCalendarDate.getFullYear();
        }else if(index == 2){
            currentValue= $scope.enteredHB;
            currentDate= UtilityService.convertDateFormat($scope.HBCalendarDate);  
            currentYear= $scope.HBCalendarDate.getFullYear(); 
        }else if(index == 3){
            currentValue= $scope.bleedingOutcome;
            currentDate= UtilityService.convertDateFormat($scope.BleedingCalendarDate); 
            currentYear= $scope.BleedingCalendarDate.getFullYear();  
        }else if(index == 4){
            currentValue= $scope.enteredWeight;
            currentDate= UtilityService.convertDateFormat($scope.WeightCalendarDate);   
            currentYear= $scope.WeightCalendarDate.getFullYear();
        }else if(index == 5){
            currentValue= $scope.malariaOutcome;
            currentDate= UtilityService.convertDateFormat($scope.MalariaCalendarDate);   
            currentYear= $scope.MalariaCalendarDate.getFullYear();
        }else if(index == 6){
            currentValue= $scope.UPOutcome;
            currentDate= UtilityService.convertDateFormat($scope.UPCalendarDate);   
            currentYear= $scope.UPCalendarDate.getFullYear();
        }else if(index == 7){
            currentValue= $scope.SwellingOutcome;
            currentDate= UtilityService.convertDateFormat($scope.SwellingCalendarDate);   
            currentYear= $scope.SwellingCalendarDate.getFullYear();
        }else if(index == 8){
            currentValue= $scope.FitsOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FitsCalendarDate);   
            currentYear= $scope.FitsCalendarDate.getFullYear(); 
        }else if(index == 9){
            currentValue= $scope.USOutcome;
            currentDate= UtilityService.convertDateFormat($scope.USCalendarDate);   
            currentYear= $scope.USCalendarDate.getFullYear();
        }else if(index == 10){
            currentValue= $scope.FeverOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FeverCalendarDate);   
            currentYear= $scope.FeverCalendarDate.getFullYear();  
        }else if(index == 11){
            currentValue= $scope.FoulSmellOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FoulSmellCalendarDate);   
            currentYear= $scope.FoulSmellCalendarDate.getFullYear();
        }else if(index == 12){
            currentValue= $scope.WeaknessOutcome;
            currentDate= UtilityService.convertDateFormat($scope.WeaknessCalendarDate);   
            currentYear= $scope.WeaknessCalendarDate.getFullYear(); 
        }else if(index == 13){
            currentValue= $scope.BPOutcome;
            currentDate= UtilityService.convertDateFormat($scope.BPCalendarDate);   
            currentYear= $scope.BPCalendarDate.getFullYear(); 
        }
        var currentMonth = UtilityService.showMonthFromDate(currentDate);
        checkUp(index,currentMonth,currentValue,currentYear);
     }

   
    function checkUp(symptomIndex, month, value,selectedyear){
         //var month={'monthNo':monthNo,'monthName':monthName,'pregnancyMonthNo':i+1};
        //$scope.monthsArray.push(month);

        var TTCalendarYear = $scope.TTCalendarDate.getFullYear();
        //case when past mon is not the same as current month
            var selectedMonth = $scope.monthsArray.filter(function(e) {
              return e.monthNo == month;
            });
            if( selectedMonth.length == 0 || selectedMonth.length == 1 && selectedyear !=  selectedMonth[0].monthYear){
                  $scope.symptomData[symptomIndex].month = -1;
            }else{
                $scope.symptomData[symptomIndex].month = month;
            }
        $scope.symptomData[symptomIndex].value = value;
    }
    $scope.symptomData =[];
    if($scope.newWoman ==false){
        $scope.symptomData =[
        {////pale 0   
             month: $scope.monthsArray[lastPaleEyeObject.month -1].monthNo,
             value: lastPaleEyeObject.value
        },{  ////NB 1
            month: $scope.monthsArray[lastNightBlindObject.month-1].monthNo,
            value:lastNightBlindObject.value
        },{//2 HB
            month: $scope.monthsArray[lastHBObject.month-1].monthNo,
            value:lastHBObject.value
        },{//3 BLEEDIN
            month: $scope.monthsArray[lastBleedingObject.month-1].monthNo,
            value:lastBleedingObject.value
        },{//4  for weight
            month: $scope.monthsArray[lastWtObject.month-1].monthNo,
            value:lastWtObject.value
        },{//5 MALARIA
            month: $scope.monthsArray[lastMalariaObject.month-1].monthNo,
            value:lastMalariaObject.value
        },{//6
            month: $scope.monthsArray[lastUPObject.month-1].monthNo,
            value:lastUPObject.value
        },{//7   SWELLING
            month: $scope.monthsArray[lastSwellingObject.month-1].monthNo,
            value:lastSwellingObject.value
        },{//8
            month: $scope.monthsArray[lastFitsObject.month-1].monthNo,
            value:lastFitsObject.value
        },{//9
            month: $scope.monthsArray[lastUSObject.month-1].monthNo,
            value:lastUSObject.value
        },{//10
            month: $scope.monthsArray[lastFeverObject.month-1].monthNo,
            value:lastFeverObject.value
        },{//11
            month: $scope.monthsArray[lastFoulSmellObject.month-1].monthNo,
            value:lastFoulSmellObject.value
        },{//12
            month: $scope.monthsArray[weaknessObject.month-1].monthNo,
            value:weaknessObject.value
        },{//13
            month: $scope.monthsArray[lastBPObject.month-1].monthNo,
            value:lastBPObject.value
        }];
    }else{
        for(var i=0;i<14;i++){
            $scope.symptomData.push({month:0,value:''});
        }
    }
    

    //watch Dod    
    $scope.$watch(function(scope) {return $scope.DODCalendarDate},
        function() {
            if($scope.DODCalendarDate){
            $scope.FPMethod =-1;    
            $scope.dateOfDelivery = false;
            }
        }
    );
   
   //watching birthoutcome 
   var BirthOutcomeMethods =[{'name': 'girl'},{'name':'boy'},{'name':'misscarriage'}];
   var birthgenderList;
   $scope.selectBirthGender=function(gender){
        birthgenderList = BirthOutcomeMethods.filter(function(e) {
          return e.name == gender;
        });
       $scope.birthGender = birthgenderList[0];
    }
    $scope.FPMethod =-1;
    //LOGIC FOR sELECTING fp METHOD
    var familyPlanningMethods = familyPlanning.getFamilyPlanningMethods();

      $scope.selectFPMethod = function(methodID) {
         var filteredMethodList = familyPlanningMethods.filter(function(e) {
          return e.id === methodID;
        });
        $scope.FPMethod = filteredMethodList[0];
        console.log( $scope.FPMethod);
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

    //function for setting Expected delivery date based on LMP
    
    $scope.negate = function(param) {
        return !param;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    }

   
     /*$scope.setMternalOutcome =function(x){
         alert(x);
     }*/

    //$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    $scope.liveCheck=true;
    $scope.pregnant='Sick';
    $scope.healthy="true";
    $scope.children=["girl","boy"];


    //newValue
    $scope.newValue=function(value){
        var newBormBtn=angular.element('#divID');
        if(value == "Live birth"){
            newBormBtn.removeClass("unflashclass");
            newBormBtn.addClass("flashclass");
        }else{
            newBormBtn.removeClass("flashclass");
            newBormBtn.addClass("unflashclass");
        }
    }

    // $scope.monthsArray=["1","2","3","4","5","6","7","8","9","10","11","12"];
    $scope.teams=[{name:'bb'},{name:'cc'}];
    $scope.range = function(n) {
        return new Array(n);
    }
}
$scope.opened=false;
    $scope.openedANM=false;
    $scope.openedWeight=false;
    $scope.openedHB = false;
    $scope.openedPale=false;
    $scope.openedNightBlind=false;
    $scope.openedBleeding=false;
    $scope.openedMalaria=false;//UPCalendarDate
    $scope.openedUP=false;//openedFits
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
        }else if(name == "UP"){
             $scope.openedUP=true;
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
    $scope.setEDD = function(){

        if($scope.LMPCalendarDate){
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
                     $scope.EDDCalendarDate  =UtilityService.convertDateFormat($scope.EDDCalendarDate );
                     $scope.LMPCalendarDate  =UtilityService.convertDateFormat(LMPCalendarDate);
                } else{
                    $scope.EDDCalendarDate ="";
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
   
    //SET Last 3 mons duration
   /* var d =new Date($scope.EDDCalendarDate)
    console.log($scope.EDDCalendarDate+"  edd "+d);
    var pastYrTime = UtilityService.subtractDaysFromDate($scope.EDDCalendarDate, 235);
    console.log("pastYrTime"+pastYrTime);
    var d =new Date();*/
   
    
        //save button functionality
     $scope.saveANCDetails =function(){
        if($scope.DODCalendarDate){
            if($scope.MaternalOutcome  && $scope.BirthOutcome ){
            alert("details saved");
            }else if($scope.MaternalOutcome == undefined){
                 alert("please select maternal outcome");
            }else if($scope.BirthOutcome == undefined){
                  alert("please select birth outcome");
            }
        }else{
            alert("details saved");
        }
        

    }


    /* $scope.color = {
     name: 'blue'
     };
     $scope.specialValue = {
     "id": "12345",goToNewBorn
     "value": "green"
     };*/
    //code for tap on enter button
    
});
