angular.module('uhiApp.controllers')
.controller('TranslateCtrl', function($translate, $scope){
    $scope.changeLanguage = function(langKey) {
        $translate.use(langKey);
    };
});
