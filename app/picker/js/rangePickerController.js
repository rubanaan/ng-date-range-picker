picker.controller('rangePickerController', ['$scope', '$timeout', 'pickerService', 'pickerProvider',
    function ($scope, $timeout, pickerService, pickerProvider)
    {

        //-- private variables
        var self = this;

        //-- public variables
        self.customId = $scope.customId;

        self.clickedButton           = 0;
        self.startShowCustomSettting = self.showCustom;

        self.startDate               = $scope.startDate ? pickerService.getDate($scope.startDate) : pickerProvider.startDate;
        self.endDate                 = $scope.endDate ? pickerService.getDate($scope.endDate) : pickerProvider.endDate;

        self.initialDate             = self.startDate;

        self.closeOnSelect           = !!$scope.closeOnSelect === true;
        self.mode                    = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
        self.format                  = angular.isUndefined($scope.format) ? 'DD/MM/YYYY' : $scope.format;
        self.divider                 = $scope.divider || '-';

        self.okLabel                 = pickerProvider.okLabel;
        self.cancelLabel             = pickerProvider.cancelLabel;
        self.view                    = 'DATE';

        self.rangeCustomStartEnd     = pickerProvider.rangeCustomStartEnd;
        self.rangeDefaultList        = pickerProvider.rangeDefaultList;

        self.selectedTabIndex        = 0;

        //-- public methods
        self.showCustomView    = showCustomView;
        self.dateRangeSelected = dateRangeSelected;

        //self.startTimeSelected = startTimeSelected;
        //self.endTimeSelected   = endTimeSelected;

        self.setRange = setRange;
        self.cancel   = cancel;

        //-- callbacks
        pickerService.registerCallback(self.customId + ':rangePicker:startDateSelected', startDateSelected);
        pickerService.registerCallback(self.customId + ':rangePicker:endDateSelected', endDateSelected);


        return init();

        /**
         * Initialize the controller, setup watchers, gather elements
         */
        function init ()
        {
            $scope.$watch('startDate', function (value)
            {
                if (!value)
                {
                    return;
                }

                self.startDate = pickerService.getDate(value);
                changeDate(self.startDate, self.endDate, false);
            });

            $scope.$watch('endDate', function (value)
            {
                if (!value)
                {
                    return;
                }

                self.endDate = pickerService.getDate(value);
                changeDate(self.startDate, self.endDate, false);
            });

            checkListActive();

            $timeout(function ()
            {
                changeDate(self.startDate, self.endDate, false);
            });
        }

        /**
         * Check if the current list is active.
         *
         * @returns {boolean}
         */
        function checkListActive ()
        {
            if (!self.startDate || !self.endDate)
            {
                return false;
            }

            for (var i = 0; i < self.rangeDefaultList.length; i++)
            {
                if (self.rangeDefaultList[i].startDate === 'custom')
                {
                    continue;
                }


                self.rangeDefaultList[i].active = false;

                if (self.startDate.isSame(self.rangeDefaultList[i].startDate, 'day') && self.endDate.isSame(self.rangeDefaultList[i].endDate, 'day'))
                {
                    self.rangeDefaultList[i].active = true;
                }
            }
        }

        /**
         * Changes the view.
         */
        function setNextView ()
        {
            switch (self.mode)
            {
                case  'date':
                    self.view = 'DATE';

                    if (self.selectedTabIndex === 0)
                    {
                        self.selectedTabIndex = 1
                    }
                    break;

                case  'date-time':
                    if (self.view === 'DATE')
                    {
                        self.view = 'TIME';
                    }
                    else
                    {
                        self.view = 'DATE';

                        if (self.selectedTabIndex === 0)
                        {
                            self.selectedTabIndex = 1
                        }
                    }
                    break;

                default:
                    self.view = 'DATE';

                    if (self.selectedTabIndex === 0)
                    {
                        self.selectedTabIndex = 1
                    }
            }
        }

        /**
         * Shows the custom view.
         */
        function showCustomView ()
        {
            self.showCustom       = true;
            self.selectedTabIndex = 0;
        }

        /**
         * On range selected.
         */
        function dateRangeSelected ()
        {
            self.selectedTabIndex = 0;
            self.view             = 'DATE';
            self.showCustom       = !!self.startShowCustomSettting;

            changeDate(self.startDate, self.endDate);
        }

        /**
         * On start date selected.
         *
         * @param date
         */
        function startDateSelected (date)
        {
            self.startDate = pickerService.getDate(date);

            setNextView();
        }

        /**
         * On end date selected.
         *
         * @param date
         * @param update
         */
        function endDateSelected (date, update)
        {
            self.endDate = pickerService.getDate(date);

            if (self.closeOnSelect && self.mode === 'date')
            {
                changeDate(self.startDate, self.endDate, update);
            }
            else
            {
                setNextView();
            }
        }

        /**
         * Sets the range.
         *
         * @param startDate
         * @param endDate
         */
        function setRange (startDate, endDate)
        {
            self.startDate = startDate;
            self.endDate   = endDate;

            changeDate(self.startDate, self.endDate);
        }

        /**
         * Changes the date.
         *
         * @param startDate
         * @param endDate
         * @param update
         */
        function changeDate (startDate, endDate, update)
        {
            let range = {startDate: startDate, endDate: endDate};

            self.selectedTabIndex = 0;
            self.view             = "DATE";

            if (angular.isUndefined(update) || update === true)
            {
                pickerService.executeCallback(self.customId + ':rangePicker:close', range);
            }
            pickerService.executeCallback(self.customId + ':calendar:changeDate', range);

            checkListActive();
        }

        /**
         * Closes the rangepicker.
         */
        function cancel ()
        {
            self.selectedTabIndex = 0;
            self.showCustom       = false;

            pickerService.executeCallback(self.customId + ':rangePicker:close');
        }
    }
]);