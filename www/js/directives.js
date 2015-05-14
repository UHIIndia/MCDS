angular.module('uhiApp')
.directive('charOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^A-Za-z\s]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
})
.directive('houseCode', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^A-Za-z0-9/-]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
})
.directive('numOnly', function($timeout) {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            var min = +attrs.min;
            var max = +attrs.max;
            //var lastValue = null;
            var lastTimeout = null;
            var delay = 1500;

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }            

                if (lastTimeout) {
                    $timeout.cancel(lastTimeout);
                }

                /*if (!lastValue) {
                    lastValue = ngModelCtrl.$modelValue;
                }*/

                if (val.length) {                   
                    var value = +val;
                    var cleaned = val.replace( /[^0-9]/g, ''); 
                    var clean;
                    // This has no non-numeric characters
                    if (val.length === cleaned.length) {
                        clean = +cleaned;

                        if (clean < min) {
                          // show min value
                            clean = min;
                          delay=1500;
                        } else if (clean > max) {
                          //show the max value
                          //clean = max;
                          // don't show that character
                          cleaned = cleaned.slice(0,-1);
                            clean = +cleaned;
                            delay=0;
                        }

                        if (value !== clean) {
                            lastTimeout = $timeout(function () {
                                //lastValue = clean;
                                ngModelCtrl.$setViewValue(clean);
                                ngModelCtrl.$render();
                            }, delay);
                        }
                    // This has non-numeric characters, filter them out
                    } else {
                      clean = cleaned;
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                }

                return clean;
            });       
          
          element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

            
        }
    };
})
.directive('decimalOnly', function($timeout) {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            var min = +attrs.min;
            var max = +attrs.max;
            //var lastValue = null;
            var lastTimeout = null;
            var delay = 1500;

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    val = '';
                }            

                if (lastTimeout) {
                    $timeout.cancel(lastTimeout);
                }

                /*if (!lastValue) {
                    lastValue = ngModelCtrl.$modelValue;
                }*/

                if (val.length) {                   
                    var value = +val;
                    var cleaned = val.replace( /[^0-9.]/g, ''); 
                    var clean;
                    // This has no non-numeric characters
                    if (val.length === cleaned.length) {
                        clean = +cleaned;

                        if (clean < min) {
                          // show min value
                            clean = min;
                          delay = 1500;
                        } else if (clean > max) {
                          //show the max value
                          //clean = max;
                          // don't show that character
                          cleaned = cleaned.slice(0,-1);
                            clean = +cleaned;
                            delay=0;
                        }

                        if (value !== clean) {
                            lastTimeout = $timeout(function () {
                                //lastValue = clean;
                                ngModelCtrl.$setViewValue(clean);
                                ngModelCtrl.$render();
                            }, delay);
                        }
                    // This has non-numeric characters, filter them out
                    } else {
                      clean = cleaned;
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                }

                return clean;
            });       
          
          element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

            
        }
    };
});