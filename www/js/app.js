// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'pascalprecht.translate', 'starter.controllers', 'starter.services', 'ngCordova', 'ui.bootstrap'])


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
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup the state for the login directive
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginController'
  })

  // setup the abstract state for the home directive
  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: 'HomeController'
  })
  .state('add', {
    url: "/add/{id}",
    templateUrl: "templates/add.html",
    controller: 'AddController'
  })
  .state('anc', {
    url: "/anc",
    templateUrl: "templates/anc.html",
    controller: 'AncController'
  })
  .state('fp', {
    url: "/fp",
    templateUrl: "templates/fp.html",
    controller: 'FpController'
  })
  .state('mapWomen', {
    url: "/map-women",
    templateUrl: "templates/map-women.html",
    controller: 'MapWomenController'
  })
  .state('mapChildren', {
    url: "/map-children",
    templateUrl: "templates/map-children.html",
    controller: 'MapChildrenController'
  })
  .state('listWomen', {
    url: "/list-women",
    templateUrl: "templates/list-women.html",
    controller: 'ListWomenController'
  })
  .state('listChildren', {
    url: "/list-children",
    templateUrl: "templates/list-children.html",
    controller: 'ListChildrenController'
  })
  .state('reportWomen', {
    url: "/report-women",
    templateUrl: "templates/report-women.html",
    controller: 'ReportWomenController'
  })
  .state('reportChildren', {
    url: "/report-children",
    templateUrl: "templates/report-children.html",
    controller: 'ReportChildrenController'
  })
  .state('film', {
    url: "/film",
    templateUrl: "templates/film.html",
    controller: 'FilmController'
  })
  .state('newborn', {
    url: "/newborn",
    templateUrl: "templates/new-born.html"
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
});