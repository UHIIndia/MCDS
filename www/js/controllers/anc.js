angular.module('uhiApp.controllers')
.controller('AncController', function($scope,$timeout,UtilityService,$location) {

    var womanData={ "womanID": "0121230250012001", // city+slum+worker+house+woman
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
        "currentPreg":{
            "LMP":"9/12/2014",
            "EDD":"2/10/2015"
        },
        "ANC":[{"Month":1,
            "ANC":null,
            "Weight":null,
            "WeightDate":"2/2/2015",
            "TT":null,
            "HB":5,
            "HBDate":"2/4/2015",
            "PaleEye":null,
            "Bleeding":null,
            "Malaria":null,
            "IFATablets":20,
            "IFADate":"2/2/2015",
            "Bp":null,
            "Swelling":null,
            "Headache":null,
            "UrineProtein":"yes",
            "UrineSugar":null,
            "NightBlindness":null,
            "FoulSmellingDischarge":null,
            "Fever":null,
            "OtherInfection":null,
            "ASHAVisit":"2/2/2015",
            "ANMVisit":"2/11/2014",
            "DeliveryDate":null,
            "MaternalOutcome":null,
            "BirthOutcome":null,
            "BirthWeight":null
        },{
            "Month":2,
            "currentMonth":2,
            "ANC1":null,
            "Weight":45,
            "WeightDate":"2/4/2015",
            "TT1":null,
            "HB":5,
            "HBDate":"2/4/2015",
            "PaleEye":"yes",
            "PaleEyeDate":"2/4/2015",
            "Bleeding":'yes',
            "Malaria":'yes',
            "IFATablets":30,
            "IFADate":"2/4/2015",
            "Bp":null,
            "Swelling":'yes',
            "Headache":'yes',
            "UrineProtein":"no",
            "UrineSugar":"yes",
            "NightBlindness":'yes',
            "FoulSmellingDischarge":"yes",
            "Fever":"yes",
            "OtherInfection":"yes",
            "ASHAVisit":null,
            "ANMVisit":"2/4/2015",
            "DeliveryDate":null,
            "MaternalOutcome":null,
            "BirthOutcome":null,
            "BirthWeight":null
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
    womanData.currentPreg.LMP =null;
    $scope.ancDOB = womanData.dob;
    $scope.ancAge =womanData.age;
    $scope.newWoman=false;

    $scope.enterPregnantWomanDetails=function(){
        if($scope.LMPCalendarDate && $scope.EDDCalendarDate){
              $scope.pregWomanExist=true;
              $scope.newWoman=true;
              showPregDetails($scope.LMPCalendarDate,$scope.EDDCalendarDate);
        }
        //$scope.pregWomanExist=true;
       // $scope.newWoman=true;
       // $scope.newWoman=true;
        //showPregDetails("25/02/15","1/05/2015");
             
     }
     //check for whther the woman has prgnant details or she is a new woman
    if(womanData.currentPreg.LMP == null || womanData.currentPreg.EDD == null ){           //a new woamn
        $scope.enterButton=true;
        $scope.pregWomanExist=false;
      
        // showPregDetails(LMP,EDD);
    }else{
        var LMP =  womanData.currentPreg.LMP; // 9/2/2015
        var EDD = womanData.currentPreg.EDD;
        showPregDetails(LMP,EDD);
    }

    function showPregDetails(LMP,EDD){
       
    $scope.pregWomanExist=true;                //already exists
    $scope.disableButton=true;       
    $scope.LMPCalendarDate = LMP;
    $scope.EDDCalendarDate = EDD;
    
    $scope.monthsArray = [];
    $scope.chooseMonth = 5;
    var todayDate=new Date();
   
   
    $scope.totalAshaCount = 0;
     currentMonth = todayDate.getMonth()+1;         //get the current month


    //need to derive the first month of pregnancy
    var d = new Date();
    var deliveryDateMonth = UtilityService.showMonthFromDate($scope.EDDCalendarDate);
    if(deliveryDateMonth <= 8){
        deliveryDateMonth =parseInt(deliveryDateMonth)+ 12;
    }
    monthNo = deliveryDateMonth-8;
    for(var i = 0; i <9;i++){
        if(monthNo == 13){         //MOVE TO JANUARY
            monthNo = 1;
        }
        var monthName = UtilityService.showMonth(monthNo);
        var month={'monthNo':monthNo,'monthName':monthName,'pregnancyMonthNo':i+1};
        $scope.monthsArray.push(month);
        monthNo++;

    }
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
                var ashaCalendarDate = UtilityService.convertDateFormat($scope.ashaCalendarDate);
                var ashaCalendarMonth = UtilityService.showMonthFromDate(ashaCalendarDate);
                $scope.lastAshaVistMonth=ashaCalendarMonth;
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
                $scope.lastANMVistMonth = ANMCalendarMonth;
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
    $scope.WeightCalendarDate=todayDate;
    if($scope.newWoman == false){
        var lastWtObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.Month, value: e.Weight};
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

//LOGIC FOR ANAEMIA
    $scope.HBCalendarDate=todayDate;
     if($scope.newWoman == false){
        var lastHBObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.Month, value: e.HB};
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
     if($scope.newWoman == false){
     var lastPaleEyeObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.PaleEye};
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
     if($scope.newWoman == false){
        var lastNightBlindObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.NightBlindness};
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
     if($scope.newWoman == false){
        var lastBleedingObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.Bleeding};
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
    if($scope.newWoman == false){
     var lastMalariaObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.Malaria};
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

//need to apply the loop as a the last anc object can be empty for HB
    if($scope.newWoman == false){
        angular.forEach(womanData.ANC, function(ANCObj, index){
            if(ANCObj.IFATablets != null){console.log("in");
                totalIFACount=parseInt(totalIFACount) + parseInt(ANCObj.IFATablets);
            }
        })
         var lastIFAObject=_.chain(womanData.ANC).map(function(e) { 
            return {month: e.Month, value: e.IFATablets};
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
                    $scope.lastPregnancyIFAMonth=lastPregnancyIFAMonth;
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
                    $scope.lastPregnancyIFAMonth=lastPregnancyIFAMonth;
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
 
//LOGIC FOR UP
    $scope.UPCalendarDate = todayDate;
    if($scope.newWoman == false){
     var lastUPObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.UrineProtein};
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
    if($scope.newWoman == false){
     var lastSwellingObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.Swelling};
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
    if($scope.newWoman == false){
     var lastFitsObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.Headache};
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
    if($scope.newWoman == false){
     var lastUSObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.UrineSugar};
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
    if($scope.newWoman == false){
     var lastFeverObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.Fever};
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
    if($scope.newWoman == false){
         var lastFoulSmellObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.FoulSmellingDischarge};
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
     var weaknessObject=_.chain(womanData.ANC).map(function(e) { 
        return {month: e.Month, value: e.OtherInfection};
        })
        .filter(function(e){ 
            return e.value;
        })
        .sortBy('month')
        .last()
        .value();
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
        }else if(index == 1){
            currentValue= $scope.blindOutcome;
            currentDate= UtilityService.convertDateFormat($scope.NightBlindCalendarDate);
        }else if(index == 2){
            currentValue= $scope.enteredHB;
            currentDate= UtilityService.convertDateFormat($scope.HBCalendarDate);   
        }else if(index == 3){
            currentValue= $scope.bleedingOutcome;
            currentDate= UtilityService.convertDateFormat($scope.BleedingCalendarDate);   
        }else if(index == 4){
            currentValue= $scope.enteredWeight;
            currentDate= UtilityService.convertDateFormat($scope.WeightCalendarDate);   
        }else if(index == 5){
            currentValue= $scope.malariaOutcome;
            currentDate= UtilityService.convertDateFormat($scope.MalariaCalendarDate);   
        }else if(index == 6){
            currentValue= $scope.UPOutcome;
            currentDate= UtilityService.convertDateFormat($scope.UPCalendarDate);   
        }else if(index == 7){
            currentValue= $scope.SwellingOutcome;
            currentDate= UtilityService.convertDateFormat($scope.SwellingCalendarDate);   
        }else if(index == 8){
            currentValue= $scope.FitsOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FitsCalendarDate);   
        }else if(index == 9){
            currentValue= $scope.USOutcome;
            currentDate= UtilityService.convertDateFormat($scope.USCalendarDate);   
        }else if(index == 10){
            currentValue= $scope.FeverOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FeverCalendarDate);   
        }else if(index == 11){
            currentValue= $scope.FoulSmellOutcome;
            currentDate= UtilityService.convertDateFormat($scope.FoulSmellCalendarDate);   
        }else if(index == 12){
            currentValue= $scope.WeaknessOutcome;
            currentDate= UtilityService.convertDateFormat($scope.WeaknessCalendarDate);   
        }
        var currentMonth = UtilityService.showMonthFromDate(currentDate);
        checkUp(index,currentMonth,currentValue);
     }

   
    function checkUp(symptomIndex, month, value){
        $scope.symptomData[symptomIndex].month = month;
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
        }];
    }else{
        for(var i=0;i<13;i++){
            $scope.symptomData.push({month:0,value:''});
        }
    }
    

    //watch Dod    
    $scope.$watch(function(scope) {return $scope.DODCalendarDate},
        function() {
            if($scope.DODCalendarDate){
            $scope.dateOfDelivery = false;
            }
        }
    );

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
    $scope.openedHB = false;
    $scope.openedPale=false;
    $scope.openedNightBlind=false;
    $scope.openedBleeding=false;
    $scope.openedMalaria=false;//UPCalendarDate
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

    $scope.setLMP = function(){
        if($scope.EDDCalendarDate){
            var EDDDate = $scope.EDDCalendarDate,
            //isEligibleForEDD,
                currDate = new Date();  //an edd is set only if lmp is 45 days before the current date

            if(EDDDate){
                var LMPCalendarDate = UtilityService.subtractDaysFromDate(EDDDate, 279);
                $scope.LMPCalendarDate  =UtilityService.convertDateFormat(LMPCalendarDate);
                $scope.EDDCalendarDate =UtilityService.convertDateFormat($scope.EDDCalendarDate);

            }
        }
    }
    
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
