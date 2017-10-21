picker.directive('rangePickerInput',
    function ()
    {
        return {
            restrict: 'EA',
            replace:  true,
            require:  ['^ngModel'],
            scope: {
                fname:           "@",
                customId:        "@",
                label:           "@",
                isRequired:      '@',
                closeOnSelect:   '@',
                disabled:        '=',
                format:          '@',
                mode:            '@',
                divider:         '@',
                showCustom:      '@',
                weekStartDay:    "@",
                customToHome:    "@",
                customList:      '=',
                minDate:         '@',
                maxDate:         '@',
                startDate:       '@',
                endDate:         '@',
                onRangeSelect:   '&'
            },
            controller:       'rangePickerInputController',
            controllerAs:     'vm',
            bindToController: false,
            templateUrl:      'picker/range-picker-input.html'
        }
    }
);