picker.controller("calendarDateController", [
  "$scope",
  "$timeout",
  "$mdMedia",
  "pickerProvider",
  "pickerService",
  function ($scope, $timeout, $mdMedia, pickerProvider, pickerService) {
    let self = this;

    self.customId = $scope.customId;

    self.dayHeader = pickerProvider.dayHeader;
    self.initialDate = $scope.initialDate;
    self.viewModeSmall = $mdMedia("xs");
    self.startDay =
      angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay === ""
        ? "Sunday"
        : $scope.weekStartDay;
    self.mode = angular.isUndefined($scope.mode) ? "DATE" : $scope.mode;
    self.format = $scope.format;

    self.minDate = $scope.minDate || null;
    self.maxDate = $scope.maxDate || null;
    self.restrictToMinDate = !!(
      angular.isDefined(self.minDate) && self.minDate
    );
    self.restrictToMaxDate = !!(
      angular.isDefined(self.maxDate) && self.maxDate
    );

    self.stopScrollPrevious = false;
    self.stopScrollNext = false;

    self.disableYearSelection = $scope.disableYearSelection;
    self.monthCells = [];
    self.dateCellHeader = [];
    self.dateCells = [];
    self.monthList = pickerProvider.shortMonthNames;
    self.fullMonthList = pickerProvider.monthNames;
    self.moveCalenderAnimation = "";
    self.rangePickType = $scope.rangePickType || null;

    self.format = angular.isUndefined(self.format) ? "MM-DD-YYYY" : self.format;

    self.currentDate = self.initialDate ? self.initialDate.clone() : null;
    self.initialDate = self.initialDate ? self.initialDate.clone() : moment();

    self.startDate = self.currentDate || pickerProvider.startDate.clone();

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

    (function init() {
      if (self.restrictToMinDate) {
        self.minDate = moment(self.minDate, self.format);
      }
      if (self.restrictToMaxDate) {
        self.maxDate = moment(self.maxDate, self.format);
      }

      if (self.rangePickType === "startDate") {
        pickerService.registerCallback(
          self.customId + ":calendar:changeDate",
          function (date) {
            self.initialDate = date.startDate
              ? date.startDate.clone()
              : moment();
            self.startDate = date.startDate
              ? date.startDate.clone()
              : pickerProvider.startDate.clone();
            self.endDate = date.endDate
              ? date.endDate.clone()
              : pickerProvider.endDate.clone();

            buildDateCells();
            changeActiveState();
          }
        );
      }

      self.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 7,
        START: 2000,
        getItemAtIndex: function (index) {
          if (this.currentIndex_ < index) {
            this.currentIndex_ = index;
          }
          return this.START + index;
        },
        getLength: function () {
          return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
        },
      };

      buildDateCells();
      buildDateCellHeader();
      buildMonthCells();
      setView();
      showYear();
    })();

    function setInitDate(date) {
      self.initialDate = angular.isUndefined(date)
        ? moment()
        : moment(date, self.format);
    }

    function setView() {
      self.headerDisplayFormat = "ddd, MMM DD";

      switch (self.mode) {
        case "date-time":
          self.view = "DATE";
          self.headerDisplayFormat = "ddd, MMM DD HH:mm";
          break;

        case "time":
          self.view = "HOUR";
          self.headerDisplayFormat = "HH:mm";
          break;

        default:
          self.view = "DATE";
      }
    }

    function showYear() {
      self.yearTopIndex =
        self.initialDate.year() -
        self.yearItems.START +
        Math.floor(self.yearItems.PAGE_SIZE / 2);
      self.yearItems.currentIndex_ =
        self.initialDate.year() - self.yearItems.START + 1;
    }

    function buildMonthCells() {
      self.monthCells = moment.months();
    }

    function buildDateCellHeader() {
      let daysByName = pickerProvider.daysNames;

      let keys = [];
      for (let key in daysByName) {
        if (!daysByName.hasOwnProperty(key)) {
          continue;
        }

        keys.push(key);
      }

      let startIndex = moment().day(self.startDay).day();
      let count = 0;
      for (let key in daysByName) {
        if (!daysByName.hasOwnProperty(key)) {
          continue;
        }

        self.dateCellHeader.push(
          daysByName[keys[(count + startIndex) % keys.length]]
        );
        count++;
      }
    }

    function buildDateCells() {
      let currentMonth = self.initialDate.month();
      let calStartDate = self.initialDate.clone().date(0).day(self.startDay);
      let weekend = false;
      let isDisabledDate = false;

      if (self.minDate) {
        self.stopScrollPrevious = self.minDate.unix() > calStartDate.unix();
      }

      self.dateCells = [];

      for (let i = 0; i < 6; i++) {
        let week = [];

        for (let j = 0; j < 7; j++) {
          let isCurrentMonth = calStartDate.month() === currentMonth;

          isDisabledDate = isCurrentMonth ? false : true;

          if (
            self.restrictToMinDate &&
            !angular.isUndefined(self.minDate) &&
            !isDisabledDate
          ) {
            isDisabledDate = self.minDate.isAfter(calStartDate);
          }

          if (
            self.restrictToMaxDate &&
            !angular.isUndefined(self.maxDate) &&
            !isDisabledDate
          ) {
            isDisabledDate = self.maxDate.isBefore(calStartDate);
          }

          let day = {
            date: calStartDate.clone(),
            dayNum: isCurrentMonth ? calStartDate.date() : "",
            month: calStartDate.month(),
            today: calStartDate.isSame(moment(), "day"),
            active: isDisabledDate ? false : isActive(calStartDate),
            start: isDisabledDate ? false : isStart(calStartDate),
            end: isDisabledDate ? false : isEnd(calStartDate),
            range: isDisabledDate ? false : isInRange(calStartDate),
            year: calStartDate.year(),
            dayName: calStartDate.format("dddd"),
            isWeekEnd: weekend,
            isDisabledDate: isDisabledDate,
            isCurrentMonth: isCurrentMonth,
          };

          week.push(day);
          calStartDate.add(1, "d");
        }

        self.dateCells.push(week);
      }

      if (self.restrictToMaxDate && !angular.isUndefined(self.maxDate)) {
        self.stopScrollNext = self.maxDate.unix() < calStartDate.unix();
      }

      if (
        self.dateCells[0][6].isDisabledDate &&
        !self.dateCells[0][6].isCurrentMonth
      ) {
        self.dateCells[0].splice(0);
      }
    }

    function changePeriod(c) {
      if (c === "p") {
        if (self.stopScrollPrevious) {
          return;
        }

        self.moveCalenderAnimation = "slideLeft";
        self.initialDate.subtract(1, "M");
      } else {
        if (self.stopScrollNext) {
          return;
        }

        self.moveCalenderAnimation = "slideRight";
        self.initialDate.add(1, "M");
      }

      buildDateCells();

      $timeout(function () {
        self.moveCalenderAnimation = "";
      }, 500);
    }

    function changeView(view) {
      if (self.disableYearSelection) {
        return false;
      } else {
        if (view === "YEAR_MONTH") {
          showYear();
        }

        self.view = view;
      }
    }

    function changeYear(year, month) {
      self.initialDate.year(year).month(month);

      buildDateCells();

      self.view = "DATE";
    }

    function setHour(hour) {
      self.currentDate.hour(hour);
    }

    function setMinute(minute) {
      self.currentDate.minute(minute);
    }

    function selectedDateTime() {
      if (self.mode === "time") {
        self.view = "HOUR";
      } else {
        self.view = "DATE";
      }

      pickerService.executeCallback(self.customId + ":calendar:close");
    }

    function closeDateTime() {
      if (self.mode === "time") {
        self.view = "HOUR";
      } else {
        self.view = "DATE";
      }

      pickerService.executeCallback(self.customId + ":calendar:close");
    }

    function checkRange(date) {
      for (let i = 0; i < self.dateCells.length; i++) {
        for (let j = 0; j < self.dateCells[i].length; j++) {
          if (
            self.dateCells[i][j].isDisabledDate ||
            !self.startDate ||
            self.endDate
          ) {
            continue;
          }

          self.dateCells[i][j].range = self.dateCells[i][j].date.isBetween(
            self.startDate,
            date,
            "day"
          );
          self.dateCells[i][j].end = self.dateCells[i][j].date.isSame(
            date,
            "day"
          );
        }
      }
    }

    function selectDate(date, isDisabled) {
      if (isDisabled) {
        return;
      }

      if (self.rangePickType && self.rangePickType === "startDate") {
        self.startDate = date;
        self.endDate = null;

        pickerService.executeCallback(
          self.customId + ":rangePicker:startDateSelected",
          date
        );
      } else if (self.rangePickType && self.rangePickType === "endDate") {
        self.endDate = date;

        pickerService.executeCallback(
          self.customId + ":rangePicker:endDateSelected",
          date
        );
      } else {
        self.currentDate = date;
      }

      changeActiveState();
    }

    function changeActiveState() {
      for (let i = 0; i < self.dateCells.length; i++) {
        for (let j = 0; j < self.dateCells[i].length; j++) {
          self.dateCells[i][j].active = isActive(self.dateCells[i][j].date);
          self.dateCells[i][j].start = isStart(self.dateCells[i][j].date);
          self.dateCells[i][j].end = isEnd(self.dateCells[i][j].date);
          self.dateCells[i][j].range = isInRange(self.dateCells[i][j].date);
        }
      }
    }

    function isActive(date) {
      if (self.currentDate) {
        if (date && self.currentDate.isSame(date, "day")) {
          return true;
        }
      }

      return false;
    }

    function isStart(date) {
      if (self.rangePickType) {
        if (self.startDate && date && self.startDate.isSame(date, "day")) {
          return true;
        }
      }

      return false;
    }

    function isEnd(date) {
      if (self.rangePickType) {
        if (self.endDate && date && self.endDate.isSame(date, "day")) {
          return true;
        }
      }

      return false;
    }

    function isInRange(date) {
      if (self.rangePickType) {
        if (
          self.endDate &&
          self.startDate &&
          date &&
          date.isBetween(self.startDate, self.endDate, "day")
        ) {
          return true;
        }
      }

      return false;
    }
  },
]);
