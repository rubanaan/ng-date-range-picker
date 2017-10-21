(function ()
{

    'use strict';

    function Calender ($timeout, picker)
    {

        return {
            restrict: 'E',
            replace: false,
            require: ['^ngModel', 'smCalender'],
            scope: {
                rangePickType: '@',
                minDate: "=",
                maxDate: "=",
                initialDate: "=",
                format: '@',
                mode: '@',
                startView: '@',
                weekStartDay: '@',
                disableYearSelection: '@',
                dateSelectCall: '&'
            },
            controller: ["$rootScope", "$scope", "$timeout", "picker", "$mdMedia", CalenderCtrl],
            controllerAs: 'vm',
            templateUrl: "picker/calender-date.html",
            link: function (scope, element, attr, ctrls)
            {
                var ngModelCtrl = ctrls[0];
                var calCtrl = ctrls[1];
                calCtrl.configureNgModel(ngModelCtrl);
            }
        }
    }

    var CalenderCtrl = function ($rootScope, $scope, $timeout, picker, $mdMedia)
    {
        var self = this;

        self.$scope = $scope;
        self.$timeout = $timeout;
        self.picker = picker;
        self.dayHeader = self.picker.dayHeader;
        self.initialDate = $scope.initialDate;
        self.viewModeSmall = $mdMedia('xs');
        self.startDay = angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay === '' ? 'Sunday' : $scope.weekStartDay;
        self.minDate = $scope.minDate || null;
        self.maxDate = $scope.maxDate || null;
        self.mode = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
        self.format = $scope.format;
        self.restrictToMinDate = angular.isDefined(self.minDate) && self.minDate ? true : false;
        self.restrictToMaxDate = angular.isDefined(self.maxDate) && self.maxDate ? true : false;
        self.stopScrollPrevious = false;
        self.stopScrollNext = false;
        self.disableYearSelection = $scope.disableYearSelection;
        self.monthCells = [];
        self.dateCellHeader = [];
        self.dateCells = [];
        self.monthList = moment.monthsShort();
        self.moveCalenderAnimation = '';
        self.rangePickType = $scope.rangePickType || null;

        self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY' : self.format;

        self.currentDate = self.initialDate ? self.initialDate.clone() : null;
        self.initialDate = self.initialDate || moment();

        self.startDate = self.currentDate || null;
        self.endDate = null;

        if (self.restrictToMinDate)
        {
            self.minDate = moment(self.minDate, self.format).subtract(1, 'd');
        }
        if (self.restrictToMaxDate)
        {
            self.maxDate = moment(self.maxDate, self.format);
        }

        if (self.rangePickType === 'startDate')
        {
            $rootScope.$on('calender-date:changeDate', function (event, date)
            {
                self.initialDate = date.startDate;
                self.startDate = date.startDate;
                self.endDate = date.endDate;

                self.changeActiveState();
            });
        }

        self.yearItems = {
            currentIndex_: 0,
            PAGE_SIZE: 7,
            START: 1900,
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

        self.init();
    };

    CalenderCtrl.prototype.setInitDate = function (dt)
    {
        var self = this;
        self.initialDate = angular.isUndefined(dt) ? moment() : moment(dt, self.format);
    };


    CalenderCtrl.prototype.configureNgModel = function (ngModelCtrl)
    {
        var self = this;

        self.ngModelCtrl = ngModelCtrl;

        ngModelCtrl.$render = function ()
        {
            self.ngModelCtrl.$viewValue = self.currentDate;
        };

    };


    CalenderCtrl.prototype.setNgModelValue = function (date)
    {
        var self = this;
        self.ngModelCtrl.$setViewValue(date);
        self.ngModelCtrl.$render();
    };

    CalenderCtrl.prototype.init = function ()
    {
        var self = this;
        self.buildDateCells();
        self.buildDateCellHeader();
        self.buildMonthCells();
        self.setView();
        self.showYear();
    };

    CalenderCtrl.prototype.setView = function ()
    {
        var self = this;
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
    };


    CalenderCtrl.prototype.showYear = function ()
    {
        var self = this;
        self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.initialDate.year() - self.yearItems.START) + 1;
    };


    CalenderCtrl.prototype.buildMonthCells = function ()
    {
        var self = this;
        self.monthCells = moment.months();
    };

    CalenderCtrl.prototype.buildDateCells = function ()
    {
        var self = this;
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
                //if(isCurrentMonth){isDisabledDate=false}else{isDisabledDate=true};

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
                    today: calStartDate.isSame(moment(), 'day') && calStartDate.isSame(moment(), 'month'),
                    active: self.isActive(calStartDate),
                    start: self.isStart(calStartDate),
                    end: self.isEnd(calStartDate),
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
    };

    CalenderCtrl.prototype.changePeriod = function (c)
    {
        var self = this;
        if (c === 'p')
        {
            if (self.stopScrollPrevious)
            {
                return;
            }
            self.moveCalenderAnimation = 'slideLeft';
            self.initialDate.subtract(1, 'M');
        } else
        {
            if (self.stopScrollNext)
            {
                return;
            }
            self.moveCalenderAnimation = 'slideRight';
            self.initialDate.add(1, 'M');
        }

        self.buildDateCells();
        self.$timeout(function ()
        {
            self.moveCalenderAnimation = '';
        }, 500);
    };


    CalenderCtrl.prototype.selectDate = function (d, isDisabled)
    {
        var self = this;
        if (isDisabled)
        {
            return;
        }

        if (self.rangePickType && self.rangePickType === 'startDate')
        {
            self.startDate = d;
        }
        else if (self.rangePickType && self.rangePickType === 'endDate')
        {
            self.endDate = d;
        }
        else
        {
            self.currentDate = d;
        }

        self.changeActiveState();

        self.$scope.dateSelectCall({date: d});
        self.setNgModelValue(d);

        self.$scope.$emit('calender:date-selected');
    };

    CalenderCtrl.prototype.changeActiveState = function ()
    {
        var self = this;

        for (var i = 0; i < self.dateCells.length; i++)
        {
            for (var j = 0; j < self.dateCells[i].length; j++)
            {
                self.dateCells[i][j].active = self.isActive(self.dateCells[i][j].date);
                self.dateCells[i][j].start = self.isStart(self.dateCells[i][j].date);
                self.dateCells[i][j].end = self.isEnd(self.dateCells[i][j].date);
            }
        }
    };

    CalenderCtrl.prototype.isActive = function (date)
    {
        var self = this;

        if (self.currentDate)
        {
            if (date && self.currentDate.isSame(date))
            {
                return true;
            }
        }

        return false;
    };

    CalenderCtrl.prototype.isStart = function (date)
    {
        var self = this;

        if (self.rangePickType)
        {
            if (self.startDate && date && self.startDate.isSame(date))
            {
                return true;
            }
        }

        return false;
    };

    CalenderCtrl.prototype.isEnd = function (date)
    {
        var self = this;

        if (self.rangePickType)
        {
            if (self.endDate && date && self.endDate.isSame(date))
            {
                return true;
            }
        }

        return false;
    };

    CalenderCtrl.prototype.buildDateCellHeader = function (startFrom)
    {
        var self = this;
        var daysByName = self.picker.daysNames;

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
    };


    /*
     Month Picker
     */
    CalenderCtrl.prototype.changeView = function (view)
    {
        var self = this;

        if (self.disableYearSelection)
        {
            return;
        }
        else
        {
            if (view === 'YEAR_MONTH')
            {
                self.showYear();
            }
            self.view = view;
        }
    };

    /*
     Year Picker
     */


    CalenderCtrl.prototype.changeYear = function (yr, mn)
    {
        var self = this;
        self.initialDate.year(yr).month(mn);
        self.buildDateCells();
        self.view = 'DATE';
    };

    /*
     Hour and Time
     */


    CalenderCtrl.prototype.setHour = function (h)
    {
        var self = this;
        self.currentDate.hour(h);
    };

    CalenderCtrl.prototype.setMinute = function (m)
    {
        var self = this;
        self.currentDate.minute(m);
    };

    CalenderCtrl.prototype.selectedDateTime = function ()
    {
        var self = this;
        self.setNgModelValue(self.currentDate);
        if (self.mode === 'time')
        {
            self.view = 'HOUR'
        } else
        {
            self.view = 'DATE';
        }
        self.$scope.$emit('calender:close');
    };

    CalenderCtrl.prototype.closeDateTime = function ()
    {
        var self = this;
        if (self.mode === 'time')
        {
            self.view = 'HOUR'
        } else
        {
            self.view = 'DATE';
        }
        self.$scope.$emit('calender:close');
    };


    var app = angular.module('smDateTimeRangePicker', []);

    app.directive('smCalender', ['$timeout', 'picker', Calender]);

})();