angular.module('uhiApp.controllers').controller('FilmWomenController', function($scope,$timeout, $rootScope,videos) {

    $scope.video = {};
    var allVideos=[]
    $scope.tab;
    var selectedList=[];
    $scope.video.fpList = videos.getFamilyPlanningVideos();
    $scope.video.anclist = videos.getANCVideos();
    $scope.video.childlist = videos.getChildVideos();
    allVideos = ($scope.video.fpList).concat($scope.video.childlist ,$scope.video.fpList);
    $scope.video.all=allVideos;
    selectedList = $scope.video.all;
    $scope.selectVideoTab =function(tabIndex){
      $scope.tab = tabIndex;
      if(tabIndex == 0){
        selectedList = $scope.video.all;
      }else if(tabIndex == 1){
        selectedList = $scope.video.fpList;
      }else if(tabIndex == 2){
        selectedList = $scope.video.anclist;
      }else if(tabIndex == 3){
        selectedList = $scope.video.childlist;
      }
    };
    $scope.playVideo = function(id) {
      var selectedVideo = selectedList[id];
      $scope.showVideo = true;
      $scope.videoPath = selectedVideo.path;
      $timeout(function() {
        document.getElementById('selected-video').play();
      }, 1000);
    };
    $scope.stopVideo = function() {
      document.getElementById('selected-video').pause();
      $scope.showVideo= false;
    };
});
