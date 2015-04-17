angular.module('starter.controllers')
.controller('AncController', function($scope,$timeout,UtilityService,$location) {

    var womanData={ "womanID": "0121230250012001", // city+slum+worker+house+woman
        "name": "seema",
        "dob": "16/12/1988",
        "age": "26",
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
            "EDD":"2/08/2015"
        },
        "ANC":[{"currentMonth":null,
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
            "UrineAlbumin":null,
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
            "Month1":null,
            "ANC1":null,
            "Weight":45,
            "WeightDate":"2/4/2015",
            "TT1":null,
            "HB":5,
            "HBDate":"2/4/2015",
            "PaleEye":"yes",
            "PaleEyeDate":"2/4/2015",
            "Bleeding1":null,
            "Malaria":null,
            "IFATablets":30,
            "IFADate":"2/4/2015",
            "Bp":null,
            "Swelling":null,
            "Headache":null,
            "UrineAlbumin":null,
            "UrineSugar":null,
            "NightBlindness":null,
            "FoulSmellingDischarge":null,
            "Fever":null,
            "OtherInfection":null,
            "ASHAVisit":null,
            "ANMVisit":"2/4/2015",
            "DeliveryDate":null,
            "MaternalOutcome":null,
            "BirthOutcome":null,
            "BirthWeight":null
        }]
    };

//display DOB,Age,LMP,EDD,and the months by calling service 9/2/2015  2/11/2015       date month year
    var dobDate = womanData.dob;
    var age = womanData.age;
    var LMP =  womanData.currentPreg.LMP; // 9/2/2015
    var EDD = womanData.currentPreg.EDD;
    var pregnancyMonthNo;
    var AshaVisitArray=[];
    var ANMVisitArray=[];
    var lastAshaVistMonth,lastAshaVistDate,lastANMVistMonth,lastANMVistDate;
    var  ashaCountTotal=0;
    var ANMCountTotal=0;
    var pregnancyMonthNoArray=[];

    $scope.DOB = dobDate;
    $scope.Age = age;
    $scope.LMP = LMP;
    $scope.EDD = EDD;
    $scope.monthsArray = [];
    $scope.chooseMonth = 5;
    var todayDate=new Date();
    $scope.ashaCalendarDate = todayDate; //set the calendar date to today
    $scope.ANMCalendarDate=todayDate;
    $scope.totalAshaCount = 0;
    var currentMonth = todayDate.getMonth()+1;         //get the current month

    //need to derive the first month of pregnancy
    var d = new Date();
    var deliveryDateMonth = UtilityService.showMonthFromDate(EDD);
    if(deliveryDateMonth <= 8){
        deliveryDateMonth =parseInt(deliveryDateMonth)+ 12;
    }
    pregnancyMonthNo = deliveryDateMonth-8;
    for(var i = 0; i <9;i++){
        if(pregnancyMonthNo == 13){         //MOVE TO JANUARY
            pregnancyMonthNo = 1;
        }
        var monthName = UtilityService.showMonth(pregnancyMonthNo);
        var month={'monthNo':pregnancyMonthNo,'monthName':monthName};
        $scope.monthsArray.push(month);
        pregnancyMonthNo++;

    }

    //logic for asha visit and ANMVisit
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
    var ashaInitializing = true;
    $scope.lastAshaVistDate = (lastAshaVistDate == undefined ?'': lastAshaVistDate);
    $scope.lastAshaVistMonth = (lastAshaVistMonth == undefined?'':lastAshaVistMonth);
    if($scope.lastAshaVistMonth == currentMonth){
        $scope.nextAshaVisitMonth = currentMonth+1;
    }else{
        $scope.nextAshaVisitMonth = currentMonth;
    }
    $scope.ashaCountTotal = ashaCountTotal;
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
                    $scope.nextAshaVisitMonth = currentMonth+1;
                }else{
                    $scope.nextAshaVisitMonth = currentMonth;
                }
            }
        }
    );
    //logic for ANC CheckUp
    // if(currentMonth != )
    angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.ANMVisit != null){console.log("in");
            ANMCountTotal++;
            ANMVisitArray.push(ANCObj.ANMVisit);
            lastANMVisitDate= ANMVisitArray[ANMVisitArray.length-1];
            lastANMVistMonth = UtilityService.showMonthFromDate(lastANMVisitDate);
            console.log(lastANMVistMonth);
        }
    })
    // var month={'monthNo':
    var ANMInitializing = true;
    $scope.lastANMVisitDate = (lastANMVisitDate == undefined ?'': lastANMVisitDate);
    $scope.lastANMVistMonth = (lastANMVistMonth == undefined?'':lastANMVistMonth);

    if($scope.lastANMVistMonth == currentMonth){
        if(currentMonth == $scope.monthsArray[7].monthNo){        // if current mon is 8    next visit is 9
            $scope.nextANMVisitMonth = currentMonth + 1;                           //   checked
        }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
            $scope.nextANMVisitMonth = currentMonth + 1;                         //
        }else{
            $scope.nextANMVisitMonth = currentMonth + 2;    //if current mon is 7or less..it will add 2.. //checked
        }
    }else if($scope.lastANMVistMonth < currentMonth){
        if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
            if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
            }else{
                $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..
            }
        }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
            $scope.nextANMVisitMonth = currentMonth;                               //
        }else{                                                  //if the current month is 7  or less
            if($scope.lastANMVistMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                $scope.nextANMVisitMonth = currentMonth + 1;                      //checked
            }else{
                $scope.nextANMVisitMonth=currentMonth;                         //checked
            }
        }
    }
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
                        $scope.nextANMVisitMonth = currentMonth + 1;                           //checked
                    }else if(currentMonth == $scope.monthsArray[8].monthNo){   //if current month is 9  nect visit is 10 and it goes out
                        $scope.nextANMVisitMonth = currentMonth + 1;                         //checked
                    }else{
                        $scope.nextANMVisitMonth = currentMonth + 2;    //if current mon is 7or less..it will add 2..checked
                    }
                }else if($scope.lastANMVistMonth < currentMonth){
                    if(currentMonth == $scope.monthsArray[7].monthNo ){             //if current month is 8
                        if($scope.lastANMVistMonth == currentMonth - 1){                         //if calendar mon is 7 an d current is 8
                            $scope.nextANMVisitMonth = currentMonth + 1;                       //checked
                        }else{
                            $scope.nextANMVisitMonth = currentMonth;                       //if cal month is 6 or less and current is 8 ..checked
                        }
                    }else if(currentMonth == $scope.monthsArray[8].monthNo ){       //if the current mon is 9
                        $scope.nextANMVisitMonth = currentMonth;                               //checked
                    }else{                                                  //if the current month is 7  or less
                        if($scope.lastANMVistMonth == currentMonth - 1){                    //if the calendar mon is 1 less
                            $scope.nextANMVisitMonth = currentMonth + 1;
                        }else{
                            $scope.nextANMVisitMonth=currentMonth;
                        }
                    }
                }

                /* if($scope.lastANMVistMonth ==   $scope.monthsArray[7].monthNo){
                 $scope.nextANMVisitMonth = currentMonth + 1;
                 }else if($scope.lastANMVistMonth == currentMonth && $scope.lastANMVistMonth < $scope.monthsArray[7].monthNo){
                 //when cal and current months are same   will work for 1 2 3 4 5 6 7
                 //if the last asha visit month is the current month ...then next action is 2 mons after it
                 $scope.nextANMVisitMonth = currentMonth + 2;
                 }else if($scope.lastANMVistMonth ==  currentMonth-1){ //when cal month is 1 mon less than current
                 // if the last asha visit month is just a month before it....then next action is 1 mon after it
                 $scope.nextANMVisitMonth = currentMonth + 1;

                 }else{
                 //otherwise the action is in current month   when the calendar mon is at least 2 mons less than current
                 $scope.nextANMVisitMonth = currentMonth;
                 }*/
            }
        }
    );
    // LOGIC FOR WT
    var WeightArray=[];
    var WeightDateArray=[];
    var lastWeightDate,lastWeightMonth,lastWeight;
    $scope.WeightCalendarDate=todayDate;
    //logic for weight
    angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.Weight != null){console.log("in");
            //ashaCountTotal++;
            console.log(ANCObj.Weight);
            WeightArray.push(ANCObj.Weight);
            WeightDateArray.push(ANCObj.WeightDate);
            lastWeight= WeightArray[WeightArray.length-1];
            lastWeightDate= WeightDateArray[WeightDateArray.length-1];
            lastWeightMonth = UtilityService.showMonthFromDate(lastWeightDate);
            console.log(lastWeightMonth);
        }
    })
    var WeightInitializing = true;
    $scope.lastWeightDate = (lastWeightDate == undefined ?'':lastWeightDate);
    $scope.lastWeightMonth = (lastWeightMonth == undefined?'':lastWeightMonth);
    $scope.lastWeight = (lastWeight == undefined?'':lastWeight);
    if($scope.lastWeight < 40){
        $scope.weightAlert = true;
    }
    $scope.$watch(function(scope) {return $scope.WeightCalendarDate},
        function() {
            if (WeightInitializing) {
                $timeout(function() { WeightInitializing = false; });
            } else {
                if($scope.enteredWeight == undefined){
                    alert(" please enter weight");
                }else{
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
                            if(currentWt < $scope.lastWeight){
                                $scope.weightAlert = true;
                            }
                        }
                    }
                    $scope.lastWeight=currentWt;
                }
            }
        }
    );

//LOGIC FOR ANAEMIA
    $scope.HBCalendarDate=todayDate;
    var length,lastHBValue,lastHBDate;
    var HBArray=[];
    var HBDateArray=[];

//need to apply the loop as a the last anc object can be empty for HB
    angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.HB != null){console.log("in");
            //ashaCountTotal++;
            console.log(ANCObj.Weight);
            HBArray.push(ANCObj.HB);
            HBDateArray.push(ANCObj.HBDate);
            lastHBValue= HBArray[HBArray.length-1];
            lastHBDate= HBDateArray[HBDateArray.length-1];
            lastHBMonth = UtilityService.showMonthFromDate(lastHBDate);
            console.log(lastWeightMonth);
        }
    })

    $scope.lastHBValue = (lastHBValue == undefined ?'':lastHBValue);
    $scope.lastHBMonth = (lastHBMonth == undefined?'': lastHBMonth);
    if(lastHBValue < 10){
        $scope.alertHB = true;
    }
    var HBInitializing = true;
    $scope.$watch(function(scope) {return $scope.HBCalendarDate},
        function() {
            if (HBInitializing) {
                $timeout(function() { HBInitializing = false; });
            }else {
                if($scope.enteredHB == undefined){
                    alert(" please enter HB");
                }else{
                    var currentHB = $scope.enteredHB;
                    var currentHBDate = UtilityService.convertDateFormat($scope.HBCalendarDate);
                    var currentHBMonth = UtilityService.showMonthFromDate(currentHBDate);
                    if(currentHB < 10){
                        $scope.alertHB = true;
                    }else{
                        $scope.alertHB = false;
                    }
                    $scope.lastHBValue=currentHB;
                }
            }
        }
    );


//LOGIC FOR Pale Eye
    $scope.PaleCalendarDate = todayDate;
    var lastPaleEyeValue,lastPaleEyeDate;
    var PaleEyeArray=[];
    var PaleEyeDateArray=[];
//need to apply the loop as a the last anc object can be empty for HB
    angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.PaleEye != null){console.log("in");
            PaleEyeArray.push(ANCObj.PaleEye);
            PaleEyeDateArray.push(ANCObj.PaleEyeDate);
            lastPaleEyeValue= PaleEyeArray[PaleEyeArray.length-1];
            lastPaleEyeDate= PaleEyeDateArray[PaleEyeDateArray.length-1];
            lastPaleEyeMonth = UtilityService.showMonthFromDate(lastPaleEyeDate);
            console.log(lastPaleEyeMonth);
        }
    })

    $scope.lastPaleEyeValue = (lastPaleEyeValue == undefined ?'':lastPaleEyeValue);
    $scope.lastPaleEyeMonth = (lastPaleEyeMonth == undefined?'': lastPaleEyeMonth);
    if(lastPaleEyeValue.toLowerCase() == "yes" ){
        $scope.alertPaleEye = true;
    }
    var PaleInitializing = true;
    $scope.$watch(function(scope) {return $scope.PaleCalendarDate},
        function() {
            // ....

            if (PaleInitializing) {
                $timeout(function() { PaleInitializing = false; });
            }else {
                if($scope.enteredPaleEyeValue == undefined){
                    alert(" please select one ");
                }else{
                    
                    var currentPaleEyeValue = $scope.enteredPaleEyeValue;
                    var currentPaleEyeDate = UtilityService.convertDateFormat($scope.PaleCalendarDate);
                    var currentPaleEyeMonth = UtilityService.showMonthFromDate(currentPaleEyeDate);
                    if(currentPaleEyeValue == 'yes'){
                        $scope.alertPaleEye = true;
                    }else{
                        $scope.alertPaleEye = false;
                    }
                    $scope.lastPaleEyeValue=currentPaleEyeValue;
                    checkUp(0,currentPaleEyeMonth,currentPaleEyeValue);
                }
            }
        }
    );

      $scope.NightBlindCalendarDate = todayDate;
     var NightBlindInitializing = true;
    $scope.$watch(function(scope) {console.log('bling val changing --------------');return $scope.blindOutcome},
        function() {
            // ....

            /*if (NightBlindInitializing) {
                $timeout(function() { NightBlindInitializing = false; });
            }else {*/
                console.log('bling val changing insidethe better plc --------------');
                if($scope.enteredBlindValue == undefined){
                    console.log(" please select one ");
                }else{
                    var currentBlindValue = $scope.enteredBlindValue;
                    var currentBlindDate = UtilityService.convertDateFormat($scope.NightBlindCalendarDate);
                    var currentBlindMonth = UtilityService.showMonthFromDate(currentBlindDate);
                    if(currentBlindValue == 'yes'){
                        $scope.alertPaleEye = true;
                    }else{
                        $scope.alertPaleEye = false;
                    }
                   // $scope.lastPaleEyeValue=currentBlindValue;
                    checkUp(1,currentBlindMonth,currentBlindValue);
                }
            //}
        }
    );
 $scope.$watch(function(scope) {console.log('bling val changing --------------');return $scope.NightBlindCalendarDate},
        function() {
            // ....

            /*if (NightBlindInitializing) {
                $timeout(function() { NightBlindInitializing = false; });
            }else {*/
                console.log('bling val changing insidethe better plc --------------');
                if($scope.NightBlindCalendarDate == undefined){
                    console.log(" please select one ");
                }else{
                    var currentBlindValue = $scope.enteredBlindValue;
                    var currentBlindDate = UtilityService.convertDateFormat($scope.NightBlindCalendarDate);
                    var currentBlindMonth = UtilityService.showMonthFromDate(currentBlindDate);
                    if(currentBlindValue == 'yes'){
                        $scope.alertPaleEye = true;
                    }else{
                        $scope.alertPaleEye = false;
                    }
                   // $scope.lastPaleEyeValue=currentBlindValue;
                    checkUp(1,currentBlindMonth,currentBlindValue);
                }
            //}
        }
    );
    function checkUp(symptomIndex, month, value){
        $scope.symptomData[symptomIndex].month = month;
        $scope.symptomData[symptomIndex].value = value;
    }
    $scope.symptomData =[
        {
            month: lastPaleEyeMonth,
            value:lastPaleEyeValue
        },{
            month: 2,
            value:'yes'
        }];
    $scope.newPaleEyeValue = function(value,option){
        if(option == 'pale'){
             $scope.enteredPaleEyeValue=value;
         }else{
             $scope.enteredBlindValue=value;
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
    angular.forEach(womanData.ANC, function(ANCObj, index){
        if(ANCObj.IFATablets != null){console.log("in");
            totalIFACount=parseInt(totalIFACount) + parseInt(ANCObj.IFATablets);
            lastIFACount= ANCObj.IFATablets;
            lastIFADate= ANCObj.IFADate;
            lastIFAMonth = UtilityService.showMonthFromDate(lastIFADate);
        }
    })

    $scope.lastIFACount = (lastIFACount == 0 ?'':lastIFACount);
    $scope.lastIFAMonth = (lastIFAMonth == undefined?'': lastIFAMonth);
    $scope.totalIFACount = (totalIFACount == 0 ?'':totalIFACount);
    console.log(currentMonth );
    if(totalIFACount <= 100){
        if($scope.lastIFAMonth == currentMonth){
            $scope.nextIFAVisit = currentMonth+1;
        }else{
            $scope.nextIFAVisit = currentMonth;
        }
        $scope.alertIFA = true;
    }
    console.log("next ifa  "+$scope.nextIFAVisit );
    var IFAInitializing = true;
    $scope.$watch(function(scope) {return $scope.IFACalendarDate},
        function() {
            if (IFAInitializing) {
                $timeout(function() { IFAInitializing = false; });
            }else {
                if($scope.enteredIFA == undefined){
                    alert(" please enter one ");
                }else{
                    var currentIFA = $scope.enteredIFA;
                    totalIFACount=totalIFACount+currentIFA;
                    if(totalIFACount <100){
                        $scope.alertIFA = true;
                    }
                    var currentIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var currentIFAMonth = UtilityService.showMonthFromDate(currentIFADate);
                    $scope.lastIFAMonth=currentIFAMonth;
                    $scope.lastIFACount=currentIFA;
                }
            }
        }
    );
    $scope.getDate=function(){
        var today=new Date();
        var currentMonth=today.getMonth()+1;
        var currentDay=today.getDate();
        var currentYear=today.getFullYear();
        return currentYear+"-"+currentMonth+"-"+currentDay;
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
        }
    }
    $scope.openANM = function($event) {console.log("inside")
        $event.preventDefault();
        $event.stopPropagation();

    }

    $scope.negate = function(param) {
        return !param;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    }

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

    /* $scope.color = {
     name: 'blue'
     };
     $scope.specialValue = {
     "id": "12345",goToNewBorn
     "value": "green"
     };*/
    //code for tap on enter button
    $scope.submitForm = function (pregnant,birthOutcome){
        // alert($element.find('.unflashclass'));

        //  alert(angular.element(elem.querySelector('.unflashclass')));
        //alert(element(by.model('newBorn')));
        alert(pregnant);
        alert(birthOutcome);
        $scope.unflashclass="flashclass";
        if(birthOutcome =="Live birth"){


        }
        //alert($scope.pregnancyCondition);
    }
    $scope.submitAnswer=function(user){

        alert(user.answer);

    }

    $scope.isPaleEye=function(value){
        alert($scope.pale0);
        //alert($scope.paleEyeCheck);
        alert(value);
        if(value== "Yes"){

        }else{

        }
        // monthNo

    }

});
