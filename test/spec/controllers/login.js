'use strict';

describe('Controller: LoginController', function(){
  var scope, location;

  // load the controller's module
  beforeEach(module('uhiApp.controllers'));

  beforeEach(inject(function($rootScope, $controller, _$location_) {
    scope = $rootScope.$new();
    location = _$location_;
    $controller('LoginController', {$scope: scope});
  }));

  it('should set correct scope variables when right worker logs in', function(){
    scope.workerCode = '123';
    scope.enterHome();
    expect(scope.required).toBe(false);
    expect(scope.incorrect).toBe(false);
  });

  it('should redirect to home on successful login', function(){
    scope.workerCode = '123';
    scope.enterHome();
    expect(location.path()).toBe('/home');
  });

  it('should notify for missing mandatory field when worker code is not provided', function() {
    scope.workerCode = '';
    scope.enterHome();
    expect(scope.required).toBe(true);
  });

  it('should notify for failed login when incorrect worker code is provided', function() {
    scope.workerCode = '123456';
    scope.enterHome();
    expect(scope.incorrect).toBe(true);
  });

});
