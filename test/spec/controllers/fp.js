'use strict';

describe('Controller: FpController', function(){
  var scope, WomanServiceMock, familyPlanningMock, videosMock;

  // load the controller's module
  beforeEach(module('uhiApp.controllers'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();

    WomanServiceMock = jasmine.createSpyObj('WomanService', ['getWomanDetails']);
    WomanServiceMock.getWomanDetails.and.returnValue({});

    familyPlanningMock = jasmine.createSpyObj('familyPlanning', ['getFamilyPlanningMethods']);
    familyPlanningMock.getFamilyPlanningMethods.and.returnValue([]);

    videosMock = jasmine.createSpyObj('videos', ['getFamilyPlanningVideos']);
    videosMock.getFamilyPlanningVideos.and.returnValue([]);

    $controller('FpController', {
      $scope: scope,
      WomanService: WomanServiceMock,
      familyPlanning: familyPlanningMock,
      videos: videosMock
    });
  }));

  it('should have a defined woman in context', function(){
    expect(scope.woman).toBeDefined();
  });

  it('should select a family planning method when chosen one', function(){
    expect(scope.FPMethod).toBeDefined();
  });

  it('should show a message when a family planning method is selected', function(){
    expect(scope.message).toBeDefined();
  });

  it('should show a follow up question when a family planning method is selected', function(){
    expect(scope.message).toBeDefined();
  });

  it('should have a list of videos', function(){
    expect(scope.video.list).toBeDefined();
  });

  it('should play the video when thumbnail is clicked', function(){
    expect(scope.video.path).toBeDefined();
    expect(scope.video.show).toBe(true);
  });

  it('should stop the video when clicked outside video container', function(){
    expect(scope.video.show).toBe(false);
  });

});
