'use strict';

describe('Controller: LoginController', function(){
  var scope;

  // load the controller's module
  beforeEach(module('starter.controllers'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('LoginController', {$scope: scope});
  }));

  // tests start here
  it('should always be true', function(){
    expect(true).toBe(true);
  });
});
