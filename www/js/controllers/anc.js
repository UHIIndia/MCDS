angular.module('uhiApp.controllers')
.controller('AncController', function($scope,$timeout,UtilityService,familyPlanning,videos,WomanService,$location) {
 var womanDisplayID = UtilityService.getWomanDisplayID();
  var womanData = WomanService.getWomanDetails(womanDisplayID);
    
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
              womanData.LMP = $scope.LMPCalendarDate;
              womanData.EDD = $scope.EDDCalendarDate;  
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
        $scope.pregWomanPath = UtilityService.loadImage(womanData.womanID);
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
    var VisitItem=["paleEyeVisits","nightBlindVisits"];
   
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
        if(lastWtObject != undefined){
          if(lastWtObject.value < 40){
            $scope.weightAlert = true;
          }  
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
         if(lastTTObject != undefined){
           lastTTMonth = $scope.monthsArray[lastTTObject.month-1].monthNo;
           lastTTCount = lastTTObject.value;
         }
        $scope.lastTTCount = lastTTCount;
        selectedMonth = $scope.monthsArray.filter(function(e) {
          return e.monthNo == lastTTMonth;
        });
        $scope.pregnancylastTTMonth= (selectedMonth[0] == undefined ?'':selectedMonth[0].pregnancyMonthNo);
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
                         $scope.lastTTMonth = 0;
                         $scope.pregnancylastTTMonth= 0;
                    }else{
                        $scope.lastTTMonth = TTCalendaMonth;
                        $scope.pregnancylastTTMonth= selectedMonth[0].pregnancyMonthNo;
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
                         $scope.lastTTMonth = 0;
                         $scope.pregnancylastTTMonth = 0;
                    }else{
                       $scope.lastTTMonth = TTCalendaMonth;
                       $scope.pregnancylastTTMonth= selectedMonth[0].pregnancyMonthNo;
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
        if( lastHBObject != undefined){
            if(lastHBObject.value < 10){
            $scope.alertHB = true;
            }
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
        var lastIFAMonth= (lastIFAObject == undefined?'' : $scope.monthsArray[lastIFAObject.month].monthNo);      
        lastIFACount=  (lastIFAObject == undefined?'' :lastIFAObject.value);
        $scope.lastIFAMonth=lastIFAMonth;
        selectedMonth = $scope.monthsArray.filter(function(e) {
          return e.monthNo == lastIFAMonth;
        });
        $scope.pregnancylastIFAMonth= (selectedMonth[0] == undefined ?'':selectedMonth[0].pregnancyMonthNo);
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
      $scope.lastIFACount=lastIFACount;
      $scope.totalIFACount=totalIFACount;
     $scope.$watch(function(scope) {return $scope.IFACalendarDate},
        function() {
                if($scope.enteredIFA){
                    var currentIFA = $scope.enteredIFA;
                    totalIFACount = parseInt(totalIFACount) + parseInt(currentIFA);
                    var lastIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastIFAMonth = UtilityService.showMonthFromDate(lastIFADate);
                    var lastIFAYear = $scope.IFACalendarDate.getFullYear();
                    //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == lastIFAMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && lastIFAYear !=  selectedMonth[0].monthYear){
                         $scope.lastIFAMonth = 0;
                         $scope.pregnancylastIFAMonth = 0;
                    }else{
                        $scope.lastIFAMonth = lastIFAMonth;
                        $scope.pregnancylastIFAMonth = selectedMonth[0].pregnancyMonthNo;
                    }
                    $scope.lastIFADate =lastIFADate;
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
                    var lastIFADate = UtilityService.convertDateFormat($scope.IFACalendarDate);
                    var lastIFAMonth = UtilityService.showMonthFromDate(lastIFADate);
                    var lastIFAYear = $scope.IFACalendarDate.getFullYear();
                    //case when past mon is not the same as current month
                    var selectedMonth = $scope.monthsArray.filter(function(e) {
                      return e.monthNo == lastIFAMonth;
                    });
                    if( selectedMonth.length == 0 || selectedMonth.length == 1 && lastIFAYear !=  selectedMonth[0].monthYear){
                         $scope.lastIFAMonth = 0;
                          $scope.pregnancylastIFAMonth = 0;
                    }else{
                        $scope.lastIFAMonth = lastIFAMonth;
                         $scope.pregnancylastIFAMonth = selectedMonth[0].pregnancyMonthNo;
                    }
                    $scope.lastIFADate =lastIFADate;
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
        if(index == 0){
             checkUpforPale("paleEyeVisits",currentMonth,currentValue,currentYear);
        }else if(index == 1){
             checkUpforPale("nightBlindVisits",currentMonth,currentValue,currentYear);
        }else{
            checkUp(index,currentMonth,currentValue,currentYear);
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

                /*for (var key in $scope.visitDetails.paleEyeVisits) {
                   var obj = $scope.visitDetails.paleEyeVisits[key];
                   if(obj.monthNo == month){
                        $scope.match = 1;
                        break;
                    }
                }*/
    }        
    if($scope.newWoman ==false){
        var lastPaleEyeObject,lastBlindObject;
        var itemArray=[lastPaleEyeObject,lastBlindObject,lastHBObject,lastBleedingObject,lastWtObject,lastMalariaObject,lastUPObject,lastSwellingObject,lastFitsObject,lastUSObject,lastFeverObject,lastFoulSmellObject,weaknessObject,lastBPObject];
//htis is the check when all the pale values are null or undefined
        angular.forEach(itemArray, function(item, index) {
            var obj;
            if(item != undefined){
                obj ={month: $scope.monthsArray[item.month].monthNo, value: item.value, pregnancyMonthNo:item.month};
            }else{
                obj ={month: -1, value:'', pregnancyMonthNo:-1};
            }
            $scope.symptomData.push(obj);
        });
     }else{
        
        for(var i=0;i<14;i++){          //in case the woman is a new woman
            $scope.symptomData.push({month:-1,value:'',pregnancyMonthNo:-1});
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
   var BirthOutcomeMethods =[{'name': 'girl'},{'name':'boy'},{'name':'misscarriage'}];
   var birthgenderList;
   $scope.selectBirthGender=function(gender){
        birthgenderList = BirthOutcomeMethods.filter(function(e) {
          return e.name == gender;
        });
       $scope.birthGender = birthgenderList[0];
       womanData.birthOutcome = birthgenderList[0].name;
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


        //save button functionality
     $scope.saveANCDetails =function(){
        var VisitItem=["paleEyeVisits","nightBlindVisits","ashaVisits","anmVisits"];
        for(var i=0;i<4;i++){  //if there is an entry
            if( $scope.lastObj[VisitItem[i]] != undefined){
                if($scope.matchArray[VisitItem[i]] == 1){
                //if there is a value mismatch..then update it
                    $scope.visitDetails[VisitItem[i]][$scope.lastObj[VisitItem[i]].monthNo].value=$scope.lastObj[VisitItem[i]].value;
                }else{  //if there is a new entry
                    $scope.visitDetails[VisitItem[i]][$scope.lastObj[VisitItem[i]].monthNo]=$scope.lastObj[VisitItem[i]];
                }
            }
        }
         var ANC =[];
        var monthID, ASHAVisit,ANMVisit,weight,TT,HB,paleEye,bleeding,malaria,IFATablets,BP,swelling,headache,urineProtein,urineSugar,nightBlindness,foulSmellingDischarge,fever,otherInfection,lastUpdateDateTime;
        $scope.visitDetails.paleEyeVisits = _.indexBy($scope.visitDetails.paleEyeVisits, 'pregnancyMonthNo')
        $scope.visitDetails.nightBlindVisits = _.indexBy($scope.visitDetails.nightBlindVisits, 'pregnancyMonthNo')
        $scope.visitDetails.ashaVisits = _.indexBy($scope.visitDetails.ashaVisits, 'pregnancyMonthNo')
        $scope.visitDetails.anmVisits = _.indexBy($scope.visitDetails.anmVisits, 'pregnancyMonthNo')
        for(var i=0;i<=9;i++){ 
            monthID = i;
            if($scope.visitDetails.ashaVisits[i] !=  undefined){
                ASHAVisit = $scope.visitDetails.ashaVisits[i].value;
            }else{
                ASHAVisit = null;
            }
            if($scope.visitDetails.anmVisits[i] !=  undefined){
                ANMVisit = $scope.visitDetails.anmVisits[i].value;
            }else{
                ANMVisit = null;
            }
             if($scope.pregnancylastTTMonth == i){
                TT = $scope.lastTTCount
            }else{
                TT = null;
            }
             if($scope.pregnancylastIFAMonth == i){
                IFATablets = $scope.lastIFACount
            }else{
                IFATablets = null;
            }
            if( $scope.visitDetails.paleEyeVisits[i] !=  undefined){     //for pale eye
                    paleEye = $scope.visitDetails.paleEyeVisits[i].value;
            }else{
                paleEye = null;
            }
            if($scope.visitDetails.nightBlindVisits[i] != undefined){     //for night blind
                 nightBlindness = $scope.visitDetails.nightBlindVisits[i].value;
            }else{
                 nightBlindness = null;
            }
            if($scope.symptomData[2].pregnancyMonthNo == i){     //for pale eye
                 HB = $scope.symptomData[2].value
            }else{
                 HB = null;
            }
            if($scope.symptomData[3].pregnancyMonthNo == i){     //for night blind
                 bleeding = $scope.symptomData[3].value
            }else{
                 bleeding = null;
            }
            if($scope.symptomData[4].pregnancyMonthNo == i){     //for weight
                 weight = $scope.symptomData[4].value
            }else{
                weight = null;
            }
            if($scope.symptomData[5].pregnancyMonthNo == i){     //for night blind
                 malaria = $scope.symptomData[5].value
            }else{
                 malaria = null;
            }
            if($scope.symptomData[6].pregnancyMonthNo == i){     //for pale eye
                 urineProtein = $scope.symptomData[6].value
            }else{
                 urineProtein = null;
            }
            if($scope.symptomData[7].pregnancyMonthNo == i){     //for night blind
                 swelling = $scope.symptomData[7].value
            }else{
                 swelling = null;
            }
            if($scope.symptomData[8].pregnancyMonthNo == i){     //for fits
                 headache = $scope.symptomData[8].value
            }else{
                 headache = null;
            }
            if($scope.symptomData[9].pregnancyMonthNo == i){     //for night blind
                 urineSugar = $scope.symptomData[9].value
            }else{
                 urineSugar = null;
            }
            if($scope.symptomData[10].pregnancyMonthNo == i){     //for pale eye
                fever = $scope.symptomData[10].value
            }else{
                 fever = null;
            }
            if($scope.symptomData[11].pregnancyMonthNo == i){     //for night blind
                 foulSmellingDischarge = $scope.symptomData[11].value
            }else{
                 foulSmellingDischarge = null;
            }
            if($scope.symptomData[12].pregnancyMonthNo == i){     //for weight
                 otherInfection= $scope.symptomData[12].value
            }else{
                 otherInfection = null;
            }
            if($scope.symptomData[13].pregnancyMonthNo == i){     //for night blind
                 BP = $scope.symptomData[13].value
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
               WomanService.updateWomanDetails(womanData);
            }else if($scope.MaternalOutcome == undefined){
                alert("please select maternal outcome");    
            }else if($scope.BirthOutcome == undefined){
                alert("please select birth outcome");
            }
        }else{
              WomanService.updateWomanDetails(womanData);
        }
    }
});
