picker.directive('rangePicker',
function ()
{
    return {
        restrict: 'E',
        require:  ['^?ngModel', 'rangePicker'],
        scope: {
            customId: '@',
            format: '@',
            divider: '@',
            weekStartDay: '@',
            customToHome: '@',
            closeOnSelect: '@',
            mode: '@',
            showCustom: '@',
            customList: '=',
            minDate: '@',
            maxDate: '@',
            startDate: '@',
            endDate: '@'
        },
        terminal:         true,
        controller:       'rangePickerController',
        controllerAs:     'vm',
        bindToController: false,
        templateUrl:      'picker/range-picker.html'
    }
});