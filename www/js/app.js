// Ionic App for uhi

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'uhiApp' is the name of this angular module
// the 2nd parameter is an array of 'requires'
// 'uhiApp.controllers' is found in js/controllers.js
// 'uhiApp.services' is found in js/services.js
angular.module('uhiApp', ['ionic', 'ngCordova', 'ngTouch', 'uhiApp.controllers', 'uhiApp.services', 'pascalprecht.translate', 'ui.bootstrap'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  $stateProvider

  // setup the state for the login directive
  .state('login', {
    url: "/login",
    cache: false,
    templateUrl: "templates/login.html",
    controller: 'LoginController'
  })

  // setup the abstract state for the home directive
  .state('home', {
    url: "/home",
    cache: false,
    templateUrl: "templates/home.html",
    controller: 'HomeController'
  })
  .state('add', {
    url: "/add",
    cache: false,
    templateUrl: "templates/add.html",
    controller: 'AddController'
  })
  .state('anc', {
    url: "/anc",
    cache: false,
    templateUrl: "templates/anc.html",
    controller: 'AncController'
  })
  .state('fp', {
    url: "/fp",
    cache: false,
    templateUrl: "templates/fp.html",
    controller: 'FpController'
  })
  .state('newborn', {
    url: "/newborn",
    cache: false,
    templateUrl: "templates/new-born.html",
    controller: "newBornController"
  })
  .state('immunisation', {
    url: "/immunisation",
    cache: false,
    templateUrl: "templates/immunisation.html",
    controller: 'ImmunisationController'
  })
  .state('map', {
    url: "/map",
    cache: false,
    templateUrl: "templates/map.html",
    controller: 'MapController'
  })
  .state('listWomen', {
    url: "/list-women",
    cache: false,
    templateUrl: "templates/list-women.html",
    controller: 'ListWomenController'
  })
  .state('listChildren', {
    url: "/list-children",
    cache: false,
    templateUrl: "templates/list-children.html",
    controller: 'ListChildrenController'
  })
  .state('reportWomen', {
    url: "/report-women",
    cache: false,
    templateUrl: "templates/report-women.html",
    controller: 'ReportWomenController'
  })
  .state('reportChildren', {
    url: "/report-children",
    cache: false,
    templateUrl: "templates/report-children.html",
    controller: 'ReportChildrenController'
  })
  .state('films', {
    url: "/films",
    cache: false,
    templateUrl: "templates/films.html",
    controller: 'FilmsController'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})
.config(function($translateProvider) {
    // Our translations will go in here
    $translateProvider.useStaticFilesLoader({
        prefix: 'locale/locale-',
        suffix: '.json'
    });
$translateProvider.preferredLanguage('en');
})
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
});
