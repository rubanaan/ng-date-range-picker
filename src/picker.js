var picker = angular.module('ngDateRangePicker', []);

picker.provider('pickerProvider',
    function ()
    {
        var massagePath = "X";
        var cancelLabel = "Sluiten";
        var okLabel     = "Opslaan";

        var customHeader = {
            date:     'ddd, MMM DD',
            dateTime: 'ddd, MMM DD HH:mm',
            time:     'HH:mm'
        };

        //date picker configuration
        var daysNames = [
            {'single': 'Z', 'shortName': 'Zo', 'fullName': 'Zondag'},
            {'single': 'M', 'shortName': 'Ma', 'fullName': 'Maandag'},
            {'single': 'D', 'shortName': 'Di', 'fullName': 'Dinsdag'},
            {'single': 'W', 'shortName': 'Wo', 'fullName': 'Woensdag'},
            {'single': 'D', 'shortName': 'Do', 'fullName': 'Donderdag'},
            {'single': 'V', 'shortName': 'Vr', 'fullName': 'Vrijdag'},
            {'single': 'Z', 'shortName': 'Za', 'fullName': 'Zaterdag'}
        ];
        var dayHeader       = "shortName";
        var monthNames      = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
        var shortMonthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        //range picker configuration
        var rangeDivider = '-';

        var rangeDefaultList = [
            {
                label: monthNames[moment().month()] + ', ' + moment().format('YYYY'),
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month')
            },
            {
                label: monthNames[moment().subtract(1, 'month').month()] + ', ' + moment().subtract(1, 'month').format('YYYY'),
                startDate: moment().subtract(1, 'month').startOf('month'),
                endDate: moment().subtract(1, 'month').endOf('month')
            },
            {
                label: monthNames[moment().subtract(2, 'month').month()] + ', ' + moment().subtract(2, 'month').format('YYYY'),
                startDate: moment().subtract(2, 'month').startOf('month'),
                endDate: moment().subtract(2, 'month').endOf('month')
            },
            {},
            {
                label: 'Dit kwartaal (Q' + moment().quarter() + ')',
                startDate: moment().startOf('quarter'),
                endDate: moment().endOf('quarter')
            },
            {
                label: 'Vorig kwartaal (Q' + moment().subtract(3, 'month').quarter() + ')',
                startDate: moment().subtract(3, 'month').startOf('quarter'),
                endDate: moment().subtract(3, 'month').endOf('quarter')
            },
            {},
            {
                label: 'Dit jaar (' + moment().format('YYYY') + ')',
                startDate: moment().startOf('year'),
                endDate: moment().endOf('year')
            },
            {
                label: 'Vorig jaar (' + moment().subtract(1, 'year').format('YYYY') + ')',
                startDate: moment().subtract(1, 'year').startOf('year'),
                endDate: moment().subtract(1, 'year').endOf('year')
            }
        ];

        var rangeCustomStartEnd = ['Begin datum', 'Eind datum'];

        var startDate = rangeDefaultList[0].startDate;
        var endDate   = rangeDefaultList[0].endDate;

        return {
            setMassagePath: function (param)
            {
                massagePath = param;
            },

            setDivider: function (value)
            {
                rangeDivider = value;
            },

            setDaysNames: function (array)
            {
                daysNames = array;
            },

            setMonthNames: function (array)
            {
                monthNames = array;
            },

            setShortMonthNames: function (array)
            {
                shortMonthNames = array;
            },

            setDayHeader: function (param)
            {
                dayHeader = param;
            },

            setOkLabel: function (param)
            {
                okLabel = param;
            },

            setCancelLabel: function (param)
            {
                cancelLabel = param;
            },

            setRangeDefaultList: function (array)
            {
                rangeDefaultList = array;
            },

            setRangeCustomStartEnd: function (array)
            {
                rangeCustomStartEnd = array;
            },

            setStartDate: function (param)
            {
                startDate = param
            },

            setEndDate: function (param)
            {
                endDate = param
            },

            setCustomHeader: function (obj)
            {
                if (!angular.isUndefined(obj.date))
                {
                    customHeader.date = obj.date;
                }
                if (!angular.isUndefined(obj.dateTime))
                {
                    customHeader.dateTime = obj.dateTime;
                }
                if (!angular.isUndefined(obj.time))
                {
                    customHeader.time = obj.time;
                }
            },

            $get: function ()
            {
                return {
                    startDate: startDate,
                    endDate: endDate,

                    massagePath: massagePath,
                    cancelLabel: cancelLabel,
                    okLabel: okLabel,

                    daysNames: daysNames,
                    monthNames: monthNames,
                    shortMonthNames: shortMonthNames,
                    dayHeader: dayHeader,
                    customHeader: customHeader,

                    rangeDivider: rangeDivider,
                    rangeCustomStartEnd: rangeCustomStartEnd,
                    rangeDefaultList: rangeDefaultList
                }
            }
        }
    }
);
picker.service('pickerService',
function()
{
    //-- private variables
    let self      = this,
        callbacks = {};

    //-- public methods
    self.registerCallback = registerCallback;
    self.executeCallback  = executeCallback;
    self.getDate          = getDate;

    /**
     * Sets a callback.
     * @param name
     * @param callback
     */
    function registerCallback (name, callback)
    {
        callbacks[name] = callback;
    }

    /**
     * Do a callback.
     * @param name
     * @param first
     * @param second
     */
    function executeCallback (name, first, second)
    {
        if (angular.isFunction(callbacks[name]))
        {
            let args = [].splice.call(arguments, 0);

            args.splice(0, 1);

            callbacks[name].apply(null, args);
        }
    }

    /**
     *
     * @param date
     * @returns {*}
     */
    function getDate (date)
    {
        if (!date)
        {
            return null;
        }

        if (moment.isMoment(date))
        {
            return date;
        }

        if (!moment.isMoment(date))
        {
            return moment.unix(date);
        }

        return null;
    }
});
picker.controller('calendarDateController', ['$rootScope', '$scope', '$timeout', '$mdMedia', 'pickerProvider', 'pickerService',
    function ($rootScope, $scope, $timeout, $mdMedia, pickerProvider, pickerService)
    {
        //-- private variables
        var self = this;

        //-- public variables
        self.customId = $scope.customId;

        self.dayHeader     = pickerProvider.dayHeader;
        self.initialDate   = $scope.initialDate;
        self.viewModeSmall = $mdMedia('xs');
        self.startDay      = angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay === '' ? 'Sunday' : $scope.weekStartDay;
        self.mode          = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
        self.format        = $scope.format;

        self.minDate           = $scope.minDate || null;
        self.maxDate           = $scope.maxDate || null;
        self.restrictToMinDate = !!(angular.isDefined(self.minDate) && self.minDate);
        self.restrictToMaxDate = !!(angular.isDefined(self.maxDate) && self.maxDate);

        self.stopScrollPrevious = false;
        self.stopScrollNext     = false;

        self.disableYearSelection = $scope.disableYearSelection;
        self.monthCells = [];
        self.dateCellHeader = [];
        self.dateCells = [];
        self.monthList = pickerProvider.shortMonthNames;
        self.fullMonthList = pickerProvider.monthNames;
        self.moveCalenderAnimation = '';
        self.rangePickType = $scope.rangePickType || null;

        self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY' : self.format;

        self.currentDate = self.initialDate ? self.initialDate.clone() : null;
        self.initialDate = self.initialDate ? self.initialDate.clone() : moment();

        self.startDate   = self.currentDate || pickerProvider.startDate.clone();

        //-- public methods
        self.setInitDate = setInitDate;

        self.selectDate = selectDate;
        self.checkRange = checkRange;
        self.changeView = changeView;
        self.changePeriod = changePeriod;
        self.changeYear = changeYear;

        self.setMinute = setMinute;
        self.setHour = setHour;
        self.selectedDateTime = selectedDateTime;
        self.closeDateTime = closeDateTime;


        return init();

        /**
         * Initialize the controller, setup watchers, gather elements
         */
        function init ()
        {
            if (self.restrictToMinDate)
            {
                self.minDate = moment(self.minDate, self.format);
            }
            if (self.restrictToMaxDate)
            {
                self.maxDate = moment(self.maxDate, self.format);
            }

            if (self.rangePickType === 'startDate')
            {
                pickerService.registerCallback(self.customId + ':calendar:changeDate', function (date)
                {
                    self.initialDate = date.startDate ? date.startDate.clone() : moment();
                    self.startDate   = date.startDate ? date.startDate.clone() : pickerProvider.startDate.clone();
                    self.endDate     = date.endDate ? date.endDate.clone() : pickerProvider.endDate.clone();

                    buildDateCells();
                    changeActiveState();
                });

                //self.endDate = pickerProvider.endDate ? pickerProvider.endDate.clone() : null;
            }
            else if (self.rangePickType === 'endDate')
            {

            }

            self.yearItems = {
                currentIndex_: 0,
                PAGE_SIZE: 7,
                START: 2000,
                getItemAtIndex: function (index)
                {
                    if (this.currentIndex_ < index)
                    {
                        this.currentIndex_ = index;
                    }
                    return this.START + index;
                },
                getLength: function ()
                {
                    return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
                }
            };

            buildDateCells();
            buildDateCellHeader();
            buildMonthCells();
            setView();
            showYear();
        }


        function setInitDate (date)
        {
            self.initialDate = angular.isUndefined(date) ? moment() : moment(date, self.format);
        }


        function setView ()
        {
            self.headerDispalyFormat = "ddd, MMM DD";

            switch (self.mode)
            {
                case 'date-time':
                    self.view = 'DATE';
                    self.headerDispalyFormat = "ddd, MMM DD HH:mm";
                    break;

                case 'time':
                    self.view = 'HOUR';
                    self.headerDispalyFormat = "HH:mm";
                    break;

                default:
                    self.view = 'DATE';
            }
        }

        function showYear ()
        {
            self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
            self.yearItems.currentIndex_ = (self.initialDate.year() - self.yearItems.START) + 1;
        }

        function buildMonthCells ()
        {
            self.monthCells = moment.months();
        }

        function buildDateCellHeader ()
        {
            var daysByName = pickerProvider.daysNames;

            var keys = [];
            for (var key in daysByName)
            {
                if (!daysByName.hasOwnProperty(key))
                {
                    continue;
                }

                keys.push(key)
            }

            var startIndex = moment().day(self.startDay).day(), count = 0;
            for (var key in daysByName)
            {
                if (!daysByName.hasOwnProperty(key))
                {
                    continue;
                }

                self.dateCellHeader.push(daysByName[keys[(count + startIndex) % (keys.length)]]);
                count++;
            }
        }

        function buildDateCells ()
        {
            var currentMonth = self.initialDate.month();
            var calStartDate = self.initialDate.clone().date(0).day(self.startDay);
            var weekend = false;
            var isDisabledDate = false;

            /*
             Check if min date is greater than first date of month
             if true than set stopScrollPrevious=true
             */
            if (self.minDate)
            {
                self.stopScrollPrevious = self.minDate.unix() > calStartDate.unix();
            }

            self.dateCells = [];

            for (var i = 0; i < 6; i++)
            {
                var week = [];

                for (var j = 0; j < 7; j++)
                {

                    var isCurrentMonth = (calStartDate.month() === currentMonth);

                    isDisabledDate = isCurrentMonth ? false : true;

                    if (self.restrictToMinDate && !angular.isUndefined(self.minDate) && !isDisabledDate)
                    {
                        isDisabledDate = self.minDate.isAfter(calStartDate);
                    }

                    if (self.restrictToMaxDate && !angular.isUndefined(self.maxDate) && !isDisabledDate)
                    {
                        isDisabledDate = self.maxDate.isBefore(calStartDate);
                    }

                    var day = {
                        date: calStartDate.clone(),
                        dayNum: isCurrentMonth ? calStartDate.date() : "",
                        month: calStartDate.month(),
                        today: calStartDate.isSame(moment(), 'day'),
                        active: isDisabledDate ? false : isActive(calStartDate),
                        start: isDisabledDate ? false : isStart(calStartDate),
                        end: isDisabledDate ? false : isEnd(calStartDate),
                        range: isDisabledDate ? false : isInRange(calStartDate),
                        year: calStartDate.year(),
                        dayName: calStartDate.format('dddd'),
                        isWeekEnd: weekend,
                        isDisabledDate: isDisabledDate,
                        isCurrentMonth: isCurrentMonth
                    };

                    week.push(day);
                    calStartDate.add(1, 'd')
                }

                self.dateCells.push(week);
            }
            /*
             Check if max date is greater than first date of month
             if true than set stopScrollPrevious=true
             */
            if (self.restrictToMaxDate && !angular.isUndefined(self.maxDate))
            {
                self.stopScrollNext = self.maxDate.unix() < calStartDate.unix();
            }

            if (self.dateCells[0][6].isDisabledDate && !self.dateCells[0][6].isCurrentMonth)
            {
                self.dateCells[0].splice(0);
            }
        }

        function changePeriod (c)
        {
            if (c === 'p')
            {
                if (self.stopScrollPrevious)
                {
                    return;
                }

                self.moveCalenderAnimation = 'slideLeft';
                self.initialDate.subtract(1, 'M');
            }
            else
            {
                if (self.stopScrollNext)
                {
                    return;
                }

                self.moveCalenderAnimation = 'slideRight';
                self.initialDate.add(1, 'M');
            }

            buildDateCells();

            $timeout(function ()
            {
                self.moveCalenderAnimation = '';
            }, 500);
        }

        function changeView (view)
        {
            if (self.disableYearSelection)
            {
                return false;
            }
            else
            {
                if (view === 'YEAR_MONTH')
                {
                    showYear();
                }

                self.view = view;
            }
        }

        function changeYear (year, month)
        {
            self.initialDate.year(year).month(month);

            buildDateCells();

            self.view = 'DATE';
        }

        function setHour (hour)
        {
            self.currentDate.hour(hour);
        }

        function setMinute (minute)
        {
            self.currentDate.minute(minute);
        }

        function selectedDateTime ()
        {
            if (self.mode === 'time')
            {
                self.view = 'HOUR'
            }
            else
            {
                self.view = 'DATE';
            }

            pickerService.executeCallback(self.customId + ':calendar:close');
        }

        function closeDateTime ()
        {
            if (self.mode === 'time')
            {
                self.view = 'HOUR'
            }
            else
            {
                self.view = 'DATE';
            }

            pickerService.executeCallback(self.customId + ':calendar:close');
        }


        function checkRange (date)
        {
            for (var i = 0; i < self.dateCells.length; i++)
            {
                for (var j = 0; j < self.dateCells[i].length; j++)
                {
                    if (self.dateCells[i][j].isDisabledDate || !self.startDate || self.endDate)
                    {
                        continue;
                    }

                    self.dateCells[i][j].range = self.dateCells[i][j].date.isBetween(self.startDate, date, 'day');
                    self.dateCells[i][j].end = self.dateCells[i][j].date.isSame(date, 'day');
                }
            }
        }

        function selectDate (date, isDisabled)
        {
            if (isDisabled)
            {
                return;
            }

            if (self.rangePickType && self.rangePickType === 'startDate')
            {
                self.startDate = date;
                self.endDate = null;

                pickerService.executeCallback(self.customId + ':rangePicker:startDateSelected', date);
            }
            else if (self.rangePickType && self.rangePickType === 'endDate')
            {
                self.endDate = date;

                pickerService.executeCallback(self.customId + ':rangePicker:endDateSelected', date);
            }
            else
            {
                self.currentDate = date;
            }

            changeActiveState();
        }

        function changeActiveState ()
        {
            for (var i = 0; i < self.dateCells.length; i++)
            {
                for (var j = 0; j < self.dateCells[i].length; j++)
                {
                    self.dateCells[i][j].active = isActive(self.dateCells[i][j].date);
                    self.dateCells[i][j].start = isStart(self.dateCells[i][j].date);
                    self.dateCells[i][j].end = isEnd(self.dateCells[i][j].date);
                    self.dateCells[i][j].range = isInRange(self.dateCells[i][j].date);
                }
            }
        }

        function isActive (date)
        {
            if (self.currentDate)
            {
                if (date && self.currentDate.isSame(date, 'day'))
                {
                    return true;
                }
            }

            return false;
        }


        function isStart (date)
        {
            if (self.rangePickType)
            {
                if (self.startDate && date && self.startDate.isSame(date, 'day'))
                {
                    return true;
                }
            }

            return false;
        }

        function isEnd (date)
        {
            if (self.rangePickType)
            {
                if (self.endDate && date && self.endDate.isSame(date, 'day'))
                {
                    return true;
                }
            }

            return false;
        }

        function isInRange (date)
        {
            if (self.rangePickType)
            {
                if (self.endDate && self.startDate && date && date.isBetween(self.startDate, self.endDate, 'day'))
                {
                    return true;
                }
            }

            return false;
        }
    }
]);
picker.directive('calendarDate',
function ()
{
    return {
        restrict: 'E',
        replace:  false,
        require:  ['^ngModel', 'calendarDate'],
        scope: {
            customId:             '@',
            rangePickType:        '@',
            minDate:              "=",
            maxDate:              "=",
            initialDate:          "=",
            format:               '@',
            mode:                 '@',
            startView:            '@',
            weekStartDay:         '@',
            disableYearSelection: '@',
        },
        controller:   'calendarDateController',
        controllerAs: 'vm',
        templateUrl:  "picker/calender-date.html"
    }
});
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
picker.controller('rangePickerInputController', ['$scope', '$timeout', '$element', '$mdUtil', '$mdMedia', '$document', 'pickerService', 'pickerProvider',
function ($scope, $timeout, $element, $mdUtil, $mdMedia, $document, pickerService, pickerProvider)
{
    //-- private variables
    var self = this;

    //-- public variables
    self.isCalenderOpen = false;

    self.calenderHeight = 460;
    self.calenderWidth  = 296;

    self.customId = $scope.customId || 'one';

    self.inputPane      = $element[0].querySelector('.sm-input-container');
    self.calenderPane   = $element[0].querySelector('.sm-calender-pane');
    self.button         = $element[0].querySelector('.sm-picker-icon');
    self.calenderPan    = angular.element(self.calenderPane);
    self.calenderPan.addClass('hide hide-animate');

    self.mode           = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
    self.format         = angular.isUndefined($scope.format) ? 'DD/MM/YYYY' : $scope.format;
    self.divider        = $scope.divider || '-';

    self.disabled       = $scope.disabled;

    self.startDate = $scope.startDate;
    self.endDate   = $scope.endDate;


    self.onRangeSelect  = angular.isFunction($scope.onRangeSelect) ? $scope.onRangeSelect : false;

    self.customList     = $scope.customList || null;

    self.closeOnSelect  = !!$scope.closeOnSelect === true;

    self.bodyClickHandler = angular.bind(self, clickOutSideHandler);

    //-- public methods
    self.getVisibleViewPort  = getVisibleViewPort;
    self.show                = show;
    self.tabOutEvent         = tabOutEvent;
    self.hideElement         = hideElement;
    self.clickOutSideHandler = clickOutSideHandler;

    //-- callbacks
    pickerService.registerCallback(self.customId + ':rangePicker:close', closePicker);


    return init();


    /**
     * Initialize the controller, setup watchers, gather elements
     */
    function init ()
    {
        $scope.$watchGroup(['startDate', 'endDate'], function(newValues, oldValues, scope)
        {
            let startDate = $scope.startDate ? pickerService.getDate($scope.startDate) : pickerProvider.startDate;
            let endDate   = $scope.endDate ? pickerService.getDate($scope.endDate) : pickerProvider.endDate;

            initInput({startDate: startDate, endDate: endDate});
        });

        if (self.customList)
        {
            pickerProvider.rangeDefaultList = self.customList;
        }

        $scope.$on('$destroy', function ()
        {
            if (self.calenderPane.parentNode)
            {
                self.calenderPane.parentNode.removeChild(self.calenderPane);
            }
        });

        // if tab out hide key board
        angular.element(self.inputPane).on('keydown', function (e)
        {
            switch (e.which)
            {
                case  27:
                case  9:
                    hideElement();
                    break;
            }
        });
    }

    /**
     * Initializes the input.
     *
     * @param date
     */
    function initInput (date)
    {
        self.value = date.startDate.format(self.format) + ' ' + self.divider + ' ' + date.endDate.format(self.format);
    }

    /**
     * Makes the viewport.
     *
     * @param elementRect
     * @param bodyRect
     * @returns {{top: (*|string|Window|Number), left: (*|string|Number)}}
     */
    function getVisibleViewPort (elementRect, bodyRect)
    {
        var top = elementRect.top;
        if (elementRect.top + self.calenderHeight > bodyRect.bottom)
        {
            top = elementRect.top - ((elementRect.top + self.calenderHeight) - (bodyRect.bottom - 20));
        }

        var left = elementRect.left;
        if (elementRect.left + self.calenderWidth > bodyRect.right)
        {
            left = elementRect.left - ((elementRect.left + self.calenderWidth) - (bodyRect.right - 10));
        }

        return {
            top:  top,
            left: left
        };
    }

    /**
     * Shows the input.
     *
     * @param $event
     */
    function show ($event)
    {
        let elementRect = self.inputPane.getBoundingClientRect();
        let bodyRect    = document.body.getBoundingClientRect();

        self.calenderPan.removeClass('hide hide-animate');

        if ($mdMedia('sm') || $mdMedia('xs'))
        {
            self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
            self.calenderPane.style.top  = (bodyRect.height - 450) / 2 + 'px';
        }
        else
        {
            let rect = getVisibleViewPort(elementRect, bodyRect);
            self.calenderPane.style.left = (rect.left) + 'px';
            self.calenderPane.style.top  = (rect.top) + 'px';
        }

        document.body.appendChild(self.calenderPane);
        angular.element(self.calenderPane).focus();

        self.calenderPan.addClass('show');
        $mdUtil.disableScrollAround(self.calenderPane);

        self.isCalenderOpen = true;
        $timeout(function ()
        {
            $document.on('click', self.bodyClickHandler);
        }, 200);
    }

    /**
     * On tab key, hide element.
     *
     * @param element
     */
    function tabOutEvent (element)
    {
        if (element.which === 9)
        {
            hideElement();
        }
    }

    /**
     * Hides the element.
     */
    function hideElement ()
    {
        self.calenderPan.addClass('hide-animate');
        self.calenderPan.removeClass('show');

        $mdUtil.enableScrolling();

        if (self.button)
        {
            angular.element(self.button).focus();
        }

        $document.off('click');

        self.isCalenderOpen = false;

        $timeout(function ()
        {
            if (self.isCalenderOpen === false)
            {
                if (self.calenderPane.parentNode)
                {
                    self.calenderPane.parentNode.removeChild(self.calenderPane);
                }
            }
        });
    }

    /**
     * Closes the picker.
     *
     * @param date
     */
    function closePicker (date)
    {
        let startDate = date.startDate ? pickerService.getDate(date.startDate) : pickerProvider.startDate;
        let endDate   = date.endDate ? pickerService.getDate(date.endDate) : pickerProvider.endDate;

        self.value = startDate.format(self.format) + ' ' + self.divider + ' ' + endDate.format(self.format);

        $document.off('keydown');
        hideElement();

        if (angular.isFunction(self.onRangeSelect))
        {
            self.onRangeSelect({range: {startDate: startDate, endDate: endDate}});
        }
    }

    /**
     * Click outside to close.
     *
     * @param e
     */
    function clickOutSideHandler (e)
    {
        if (!self.button)
        {
            if ((self.calenderPane !== e.target && self.inputPane !== e.target ) && (!self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target)))
            {
                hideElement();
            }
        }
        else
        {
            if ((self.calenderPane !== e.target && self.button !== e.target ) && (!self.calenderPane.contains(e.target) && !self.button.contains(e.target)))
            {
                hideElement();
            }
        }
    }
}]);

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
angular.module('ngDateRangePicker').run(['$templateCache', function($templateCache) {$templateCache.put('picker/calender-date.html','<div class="date-picker"><div ng-class="{\'year-container\' : vm.view === \'YEAR_MONTH\'}" ng-show="vm.view === \'YEAR_MONTH\'"><md-virtual-repeat-container class="year-md-repeat" id="year-container" md-top-index="vm.yearTopIndex"><div class="repeated-item" md-on-demand="" md-virtual-repeat="yr in vm.yearItems"><div class="year" ng-class="{\'md-accent\': yr === vm.currentDate.year(), \'selected-year md-primary\': vm.initialDate.year() === yr}"><span class="year-num" ng-click="vm.changeYear(yr,vm.currentDate.month())">{{yr}}</span></div><div class="month-row"><span ng-click="vm.changeYear(yr, 0)" class="month">{{ vm.monthList[0] }}</span> <span ng-click="vm.changeYear(yr, 1)" class="month">{{ vm.monthList[1] }}</span> <span ng-click="vm.changeYear(yr, 2)" class="month">{{ vm.monthList[2] }}</span> <span ng-click="vm.changeYear(yr, 3)" class="month">{{ vm.monthList[3] }}</span> <span ng-click="vm.changeYear(yr, 4)" class="month">{{ vm.monthList[4] }}</span> <span ng-click="vm.changeYear(yr, 5)" class="month">{{ vm.monthList[5] }}</span></div><div class="month-row"><span ng-click="vm.changeYear(yr, 6)" class="month">{{ vm.monthList[6] }}</span> <span ng-click="vm.changeYear(yr, 7)" class="month">{{ vm.monthList[7] }}</span> <span ng-click="vm.changeYear(yr, 8)" class="month">{{ vm.monthList[8] }}</span> <span ng-click="vm.changeYear(yr, 9)" class="month">{{ vm.monthList[9] }}</span> <span ng-click="vm.changeYear(yr, 10)" class="month">{{ vm.monthList[10] }}</span> <span ng-click="vm.changeYear(yr, 11)" class="month">{{ vm.monthList[11] }}</span></div><md-divider></md-divider></div></md-virtual-repeat-container></div><div ng-class="{\'date-container\' : vm.view === \'DATE\'}" ng-show="vm.view===\'DATE\'"><div class="navigation" layout="row" layout-align="space-between center"><md-button aria-label="previous" class="md-icon-button scroll-button" ng-click="vm.changePeriod(\'p\')" ng-disabled="vm.stopScrollPrevious"><svg height="18" viewbox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z"></path></svg></md-button><md-button aria-label="Change Year" class="md-button" md-no-ink="" ng-class="vm.moveCalenderAnimation" ng-click="vm.changeView(\'YEAR_MONTH\')">{{ vm.fullMonthList[vm.initialDate.month()] }} {{ vm.initialDate.year() }}</md-button><md-button aria-label="next" class="md-icon-button scroll-button" ng-click="vm.changePeriod(\'n\')" ng-disabled="vm.stopScrollNext"><svg height="18" viewbox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L7.94 4.06l4.19 4.19H3v1.5h9.13l-4.19 4.19L9 15l6-6z"></path></svg></md-button></div><div class="date-cell-header"><md-button class="md-icon-button" md-autofocus="" ng-disabled="true" ng-repeat="dHead in vm.dateCellHeader">{{ dHead[vm.dayHeader] }}</md-button></div><div class="date-cell-row" md-swipe-left="vm.changePeriod(\'n\')" md-swipe-right="vm.changePeriod(\'p\')" ng-class="vm.moveCalenderAnimation"><div layout="row" ng-repeat="w in vm.dateCells"><md-button aria-label="vm.currentDate" class="date-cell md-icon-button" ng-class="{\'md-primary sm-today\': d.today,\n\t\t\t\t\t\t\t\t\'active\': d.isCurrentMonth,\n\t\t\t\t\t\t\t\t\'active\': d.active,\n\t\t\t\t\t\t\t\t\'start-date md-raised md-primary\': d.start,\n\t\t\t\t\t\t\t\t\'end-date md-raised md-primary\': d.end,\n\t\t\t\t\t\t\t\t\'in-range\': d.range,\n\t\t\t\t\t\t\t\t\'disabled\': d.isDisabledDate}" ng-click="vm.selectDate(d.date, d.isDisabledDate)" ng-disabled="d.isDisabledDate" ng-mouseenter="vm.checkRange(d.date)" ng-mouseleave="hover = false" ng-repeat="d in w"><span>{{ d.dayNum }}</span></md-button></div></div></div></div>');
$templateCache.put('picker/range-picker.html','<md-content layout="column" id="{{ id }}" class="range-picker md-whiteframe-2dp"><md-toolbar layout="row" class="md-primary"><div class="md-toolbar-tools" layout-align="space-around center"><div class="date-display"><span>{{ vm.startDate.format(vm.format) }}</span></div><div class="date-display"><span>{{ vm.endDate.format(vm.format) }}</span></div></div></md-toolbar><div layout="row"><div layout="column" class="pre-select" role="button"><div layout="column" ng-repeat="list in vm.rangeDefaultList track by $index"><md-button aria-label="{{ list.label }}" ng-if="list.label" ng-class="{\'md-primary\': list.active}" ng-click="list.startDate === \'custom\' ? vm.showCustomView() : vm.setRange(list.startDate, list.endDate)">{{list.label}}</md-button><md-divider ng-if="!list.label"></md-divider></div></div><div layout="column" class="custom-select show-calender"><div layout="row" class="tab-head"><span ng-class="{\'active\': vm.selectedTabIndex === 0}">{{ vm.rangeCustomStartEnd[0] }}</span> <span ng-class="{\'active\': vm.selectedTabIndex === 1}">{{ vm.rangeCustomStartEnd[1] }}</span><div class="ink-bar" ng-class="{\'moveLeft\': vm.selectedTabIndex === 0, \'moveRight\': vm.selectedTabIndex === 1}"></div></div><div ng-show="vm.selectedTabIndex === 0"><calendar-date ng-show="vm.view === \'DATE\'" range-pick-type="startDate" custom-id="{{ vm.customId }}" initial-date="vm.initialDate" min-date="vm.minDate" max-date="vm.maxDate" format="{{ format }}" week-start-day="{{ vm.weekStartDay }}"></calendar-date><sm-time ng-show="vm.view === \'TIME\'" ng-model="selectedStartTime" time-select-call="vm.startTimeSelected(time)"></sm-time></div><div ng-if="vm.selectedTabIndex === 1"><calendar-date ng-show="vm.view === \'DATE\'" range-pick-type="endDate" custom-id="{{ vm.customId }}" initial-date="vm.startDate" min-date="vm.startDate" max-date="vm.maxDate" format="{{ format }}" week-start-day="{{ vm.weekStartDay }}"></calendar-date><sm-time ng-show="vm.view === \'TIME\'" ng-model="selectedEndTime" time-select-call="vm.endTimeSelected(time)"></sm-time></div></div></div></md-content>');
$templateCache.put('picker/range-picker-input.html','<md-input-container md-no-float="vm.noFloatingLabel"><input name="{{ vm.fname }}" ng-model="vm.value" ng-readonly="true" type="text" aria-label="{{ vm.fname }}" ng-required="{{ vm.isRequired }}" ng-disabled="{{ vm.disabled }}" class="sm-input-container" ng-focus="vm.show()" placeholder="{{ vm.label }}"><div id="picker" class="sm-calender-pane md-whiteframe-4dp" ng-model="value"><range-picker ng-model="vm.value" custom-id="{{ vm.customId }}" custom-to-home="{{ vm.customToHome }}" custom-list="vm.customList" mode="{{ vm.mode }}" min-date="{{ vm.minDate }}" max-date="{{ vm.maxDate }}" start-date="{{ startDate }}" end-date="{{ endDate }}" close-on-select="{{ vm.closeOnSelect }}" show-custom="{{ vm.showCustom }}" week-start-day="{{ vm.weekStartDay }}" divider="{{ vm.divider }}" format="{{ vm.format }}"></range-picker></div></md-input-container>');}]);