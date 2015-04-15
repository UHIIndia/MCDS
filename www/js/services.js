angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.factory('UtilityService',function(){
  var cityCode="500", slumCode="200", workerCode="100";

  return {
    getSlumCode: function(){
      return slumCode;
    },
    getCityCode: function(){
      return cityCode;
    },
    getWorkerCode: function(){

    },
    calcAge: function(dob){
      //get age from 
    },
    generateWomanID: function(houseCode, womanNo){
      return cityCode+slumCode+workerCode+houseCode+womanNo;
    },
    showMonth:function(monthNo){

        switch(monthNo) {
        case 0:
            return "Jan"
            break;
        case 1:
            return "Feb"
            break;
        case 2:
            return "Mar"
            break;
        case 3:
            return "Apr"
            break;
        case 4:
            return "May"
            break;
        case 5:
            return "Jun"
            break;
        case 6:
            return "Jul"
            break;
        case 7:
            return "Aug"
            break;   
        case 8:
            return "Sep"
            break;
        case 9:
            return "Oct"
            break;
        case 10:
            return "Nov"
            break;
        case 11:
            return "Dec"
            break;
        default:
            return "Jan"
      }
    }
  }
});
