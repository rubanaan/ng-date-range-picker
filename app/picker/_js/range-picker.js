function smRangePicker (picker)
{
    return {
        restrict: 'E',
        require: ['^?ngModel', 'smRangePicker'],
        scope: {
            format: '@',
            divider: '@',
            weekStartDay: "@",
            customToHome: "@",
            closeOnSelect: "@",
            mode: "@",
            showCustom: '@',
            customList: '=',
            minDate: '@',
            maxDate: '@',
            rangeSelectCall: '&'
        },
        terminal: true,
        controller: ['$scope', 'picker', RangePickerCtrl],
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'picker/range-picker.html',
        link: function (scope, element, att, ctrls)
        {
            var ngModelCtrl = ctrls[0];
            var calCtrl = ctrls[1];
            calCtrl.configureNgModel(ngModelCtrl);
        }
    }
}

var RangePickerCtrl = function ($scope, picker)
{
    var self = this;

    self.scope = $scope;
    self.clickedButton = 0;
    self.startShowCustomSettting = self.showCustom;

    self.startDate = picker.startDate || picker.rangeDefaultList[0].startDate;
    self.endDate = picker.endDate || picker.rangeDefaultList[0].endDate;

    self.divider = angular.isUndefined(self.scope.divider) || self.scope.divider === '' ? picker.rangeDivider : $scope.divider;

    self.okLabel = picker.okLabel;
    self.cancelLabel = picker.cancelLabel;
    self.view = 'DATE';

    self.rangeCustomStartEnd = picker.rangeCustomStartEnd;
    self.rangeDefaultList = picker.rangeDefaultList;

    self.selectedTabIndex = 0;

    self.checkListActive();
};

RangePickerCtrl.prototype.checkListActive = function ()
{
    var self = this;

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

        if (self.startDate.isSame(self.rangeDefaultList[i].startDate) && self.endDate.isSame(self.rangeDefaultList[i].endDate))
        {
            self.rangeDefaultList[i].active = true;
        }
        else
        {
            self.rangeDefaultList[i].active = false;
        }
    }
};

RangePickerCtrl.prototype.configureNgModel = function (ngModelCtrl)
{
    this.ngModelCtrl = ngModelCtrl;
    var self = this;

    ngModelCtrl.$render = function ()
    {
        self.ngModelCtrl.$setViewValue(self.startDate.format(self.format) + ' ' + self.divider + ' ' + self.endDate.format(self.format));
    };
};

RangePickerCtrl.prototype.setNextView = function ()
{
    switch (this.mode)
    {
        case  'date':
            this.view = 'DATE';
            if (this.selectedTabIndex === 0)
            {
                this.selectedTabIndex = 1
            }
            break;
        case  'date-time':
            if (this.view === 'DATE')
            {
                this.view = 'TIME';
            } else
            {
                this.view = 'DATE';
                if (this.selectedTabIndex === 0)
                {
                    this.selectedTabIndex = 1
                }
            }
            break;
        default:
            this.view = 'DATE';
            if (this.selectedTabIndex === 0)
            {
                this.selectedTabIndex = 1
            }
    }
};

RangePickerCtrl.prototype.showCustomView = function ()
{
    this.showCustom = true;
    this.selectedTabIndex = 0;
};

RangePickerCtrl.prototype.dateRangeSelected = function ()
{
    var self = this;
    self.selectedTabIndex = 0;
    self.view = 'DATE';

    if (self.startShowCustomSettting)
    {
        self.showCustom = true;
    } else
    {
        self.showCustom = false;
    }

    self.setNgModelValue(self.startDate, self.divider, self.endDate);
};


RangePickerCtrl.prototype.startDateSelected = function (date)
{
    this.startDate = date;
    this.scope.$emit('range-picker:startDateSelected');
    this.setNextView();
};

RangePickerCtrl.prototype.startTimeSelected = function (time)
{
    this.startDate.hour(time.hour()).minute(time.minute());
    this.scope.$emit('range-picker:startTimeSelected');
    this.setNextView();
};


RangePickerCtrl.prototype.endDateSelected = function (date)
{
    var self = this;

    this.endDate = date;
    this.scope.$emit('range-picker:endDateSelected');
    if (this.closeOnSelect && this.mode === 'date')
    {
        this.setNgModelValue(this.startDate, self.divider, this.endDate);
    } else
    {
        this.setNextView();
    }
};

RangePickerCtrl.prototype.endTimeSelected = function (time)
{
    this.endDate.hour(time.hour()).minute(time.minute());
    this.scope.$emit('range-picker:endTimeSelected');
    if (this.closeOnSelect && this.mode === 'date-time')
    {
        this.setNgModelValue(this.startDate, this.divider, this.endDate);
    }
};

RangePickerCtrl.prototype.setRange = function (startDate, endDate)
{
    this.startDate = startDate;
    this.endDate = endDate;

    this.setNgModelValue(this.startDate, this.divider, this.endDate);
};

RangePickerCtrl.prototype.setNgModelValue = function (startDate, divider, endDate)
{
    var self = this;
    var range = {startDate: startDate.format(self.format), endDate: endDate.format(self.format)};
    var date = startDate.format(self.format) + ' ' + divider + ' ' + endDate.format(self.format);

    self.rangeSelectCall({range: {startDate: startDate, endDate: endDate}});

    if (self.dateName !== date)
    {
        self.dateName = date;
        self.ngModelCtrl.$setViewValue(date);
        self.ngModelCtrl.$render();
    }

    self.selectedTabIndex = 0;
    self.view = "DATE";
    self.scope.$emit('range-picker:close');
    self.scope.$emit('calender-date:changeDate', {startDate: startDate, endDate: endDate});

    self.checkListActive();
};

RangePickerCtrl.prototype.cancel = function ()
{
    var self = this;
    if (self.customToHome && self.showCustom)
    {
        self.showCustom = false;
    } else
    {
        self.selectedTabIndex = 0;
        self.showCustom = false;
        self.scope.$emit('range-picker:close');
    }
};

var app = angular.module('smDateTimeRangePicker');
app.directive('smRangePicker', ['picker', smRangePicker]);