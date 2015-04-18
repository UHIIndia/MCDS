angular.module('starter.services')
.factory('UtilityService',function(){
    var cityCode="500", slumCode="200", workerCode="100";

    return {
        alertMessages: {
            liveBirth: 'Live births can not be greater than total pregnencies',
            livingChildren: 'Living Children can not be greater than number of children birth alive'
        },
        getSlumCode: function(){
            return slumCode;
        },
        getCityCode: function(){
            return cityCode;
        },
        getWorkerCode: function(){
            return workerCode;
        },
        calcAge: function(dob, inYear){
            var currDate =new Date(),
                diffYear = currDate.getFullYear() - dob.getFullYear(),
                diffMonth = currDate.getMonth() - dob.getMonth();
            if(inYear){
                // age is calculated in years
                return diffYear;
            } else{
                //age is Calculated in months
                return 12 * diffYear + diffMonth;

            }

        },
        calcDob : function(age,inYear){
            var currDate= new Date(),
                currYear=currDate.getFullYear(),
                currMonth =currDate.getMonth() ;
            if(inYear){
                //return new Date("Jan,15,"+currYear - age);
                return new Date(currYear-age +"-01-15");//
            } else {
                //age value is in months
                var year = parseInt(age/12), month=age%12, monthDiff = currMonth - month;
                if(monthDiff>0){
                    return new Date(currYear - year+"-"+monthDiff+"-15");
                } else{
                    return new Date(currYear - year - 1+"-"+(12+monthDiff)+"-15");
                }
            }

        },
        addDaysToDate : function(dateObj, days){
            var dat = new Date(dateObj.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        },
        subtractDaysFromDate : function(dateObj, days){
            var dat = new Date(dateObj.valueOf());
            dat.setDate(dat.getDate() - days);
            return dat;
        },
        isSameDate : function(date1, date2){
            //only  checking day month and year
            return (date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate());
        },
        generateWomanID: function(houseCode, womanNo){
            return cityCode+slumCode+workerCode+houseCode+womanNo;
        },
        showMonthFromDate:function(date){
            var dateArray = date.split("/");
            return dateArray[1];
        },
        convertDateFormat:function(date){
            var day=date.getDate();
            var month=date.getMonth()+1;
            var year=date.getFullYear();
            return day+"/"+month+"/"+year;
        },
        showMonth:function(monthNo){

            switch(monthNo) {
                case 1:
                case 01:
                    return "Jan"
                    break;
                case 2:
                case 02:
                    return "Feb"
                    break;
                case 3:
                case 03:
                    return "Mar"
                    break;
                case 4:
                case 04:
                    return "Apr"
                    break;
                case 5:
                case 05:
                    return "May"
                    break;
                case 6:
                case 06:
                    return "Jun"
                    break;
                case 7:
                case 07:
                    return "Jul"
                    break;
                case 8:
                case 08:
                    return "Aug"
                    break;
                case 9:
                case 09:
                    return "Sep"
                    break;
                case 10:
                    return "Oct"
                    break;
                case 11:
                    return "Nov"
                    break;
                case 12:
                    return "Dec"
                    break;
                default:
                    return "Jan"
            }
        }
    }
});
