picker.controller('rangePickerController', ['$scope', 'pickerService', 'pickerProvider',
    function ($scope, pickerService, pickerProvider)
    {
        //-- private variables
        var self = this;

        //-- public variables
        self.clickedButton           = 0;
        self.startShowCustomSettting = self.showCustom;

        self.startDate               = pickerProvider.startDate || pickerProvider.rangeDefaultList[0].startDate;
        self.endDate                 = pickerProvider.endDate || pickerProvider.rangeDefaultList[0].endDate;

        self.initialDate             = self.startDate;

        self.divider                 = angular.isUndefined($scope.divider) || $scope.divider === '' ? pickerProvider.rangeDivider : $scope.divider;

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
        pickerService.registerCallback('rangePicker:startDateSelected', startDateSelected);
        pickerService.registerCallback('rangePicker:endDateSelected', endDateSelected);

        pickerService.registerCallback('rangePicker:changeDate', changeDate);


        return init();

        /**
         * Initialize the controller, setup watchers, gather elements
         */
        function init ()
        {
            pickerService.startDate = self.startDate;
            pickerService.endDate   = self.endDate;

            checkListActive();

            pickerService.executeCallback('rangePicker:init', {startDate: self.startDate, endDate: self.endDate});
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
            self.startDate = date;

            setNextView();
        }

        /**
         * On end date selected.
         *
         * @param date
         */
        function endDateSelected (date)
        {
            self.endDate = date;

            if (self.closeOnSelect && self.mode === 'date')
            {
                changeDate(self.startDate, self.endDate);
            }
            else
            {
                setNextView();
            }
        }

        /*
        function startTimeSelected (time)
        {
            self.startDate.hour(time.hour()).minute(time.minute());

            setNextView();
        }

        function endTimeSelected (time)
        {
            self.endDate.hour(time.hour()).minute(time.minute());

            if (self.closeOnSelect && self.mode === 'date-time')
            {
                changeDate(self.startDate, self.divider, self.endDate);
            }
        }
        */

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
         * @param dateOnly
         */
        function changeDate (startDate, endDate, dateOnly)
        {
            self.startDate = startDate || pickerProvider.startDate;
            self.endDate   = endDate   || pickerProvider.endDate;

            let range = {startDate: self.startDate, endDate: self.endDate};

            if (!dateOnly)
            {
                self.selectedTabIndex = 0;
                self.view             = "DATE";

                pickerService.executeCallback('rangePicker:close', range);
            }
            else
            {
                pickerService.executeCallback('rangePicker:init', range);
            }

            pickerService.executeCallback('calendar:changeDate', range);

            checkListActive();
        }

        /**
         * Closes the rangepicker.
         */
        function cancel ()
        {
            self.selectedTabIndex = 0;
            self.showCustom       = false;

            pickerService.executeCallback('rangePicker:close');
        }
    }
]);