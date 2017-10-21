picker.directive('rangePicker',
function ()
{
    return {
        restrict: 'E',
        require:  ['^?ngModel', 'rangePicker'],
        scope: {
            format:        '@',
            divider:       '@',
            weekStartDay:  "@",
            customToHome:  "@",
            closeOnSelect: "@",
            mode:          "@",
            showCustom:    '@',
            customList:    '=',
            minDate:       '@',
            maxDate:       '@'
        },
        terminal:         true,
        controller:       'rangePickerController',
        controllerAs:     'vm',
        bindToController: true,
        templateUrl:      'picker/range-picker.html'
    }
});