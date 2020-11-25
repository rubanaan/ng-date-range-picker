picker.controller("rangePickerController", [
  "$scope",
  "$timeout",
  "pickerService",
  "pickerProvider",
  function ($scope, $timeout, pickerService, pickerProvider) {
    let self = this;

    self.customId = $scope.customId;

    self.clickedButton = 0;
    self.startShowCustomSettings = self.showCustom;

    self.startDate = $scope.startDate
      ? pickerService.getDate($scope.startDate)
      : pickerProvider.startDate;
    self.endDate = $scope.endDate
      ? pickerService.getDate($scope.endDate)
      : pickerProvider.endDate;

    self.initialDate = self.startDate;

    self.closeOnSelect = !!$scope.closeOnSelect === true;
    self.mode = angular.isUndefined($scope.mode) ? "date" : $scope.mode;
    self.format = angular.isUndefined($scope.format)
      ? "DD/MM/YYYY"
      : $scope.format;
    self.divider = $scope.divider || "-";

    self.okLabel = pickerProvider.okLabel;
    self.cancelLabel = pickerProvider.cancelLabel;
    self.view = "DATE";

    self.rangeCustomStartEnd = pickerProvider.rangeCustomStartEnd;
    self.rangeDefaultList = pickerProvider.rangeDefaultList;

    self.selectedTabIndex = 0;

    self.showCustomView = showCustomView;
    self.dateRangeSelected = dateRangeSelected;

    self.setRange = setRange;
    self.cancel = cancel;

    pickerService.registerCallback(
      self.customId + ":rangePicker:startDateSelected",
      startDateSelected
    );
    pickerService.registerCallback(
      self.customId + ":rangePicker:endDateSelected",
      endDateSelected
    );

    (function () {
      $scope.$watch("startDate", function (value) {
        if (!value) {
          return;
        }

        self.startDate = pickerService.getDate(value);
        changeDate(self.startDate, self.endDate, false);
      });

      $scope.$watch("endDate", function (value) {
        if (!value) {
          return;
        }

        self.endDate = pickerService.getDate(value);
        changeDate(self.startDate, self.endDate, false);
      });

      checkListActive();

      $timeout(function () {
        changeDate(self.startDate, self.endDate, false);
      });
    })();

    function checkListActive() {
      if (!self.startDate || !self.endDate) {
        return false;
      }

      for (let i = 0; i < self.rangeDefaultList.length; i++) {
        if (self.rangeDefaultList[i].startDate === "custom") {
          continue;
        }

        self.rangeDefaultList[i].active = false;

        if (
          self.startDate.isSame(self.rangeDefaultList[i].startDate, "day") &&
          self.endDate.isSame(self.rangeDefaultList[i].endDate, "day")
        ) {
          self.rangeDefaultList[i].active = true;
        }
      }
    }

    function setNextView() {
      switch (self.mode) {
        case "date":
          self.view = "DATE";

          if (self.selectedTabIndex === 0) {
            self.selectedTabIndex = 1;
          }
          break;

        case "date-time":
          if (self.view === "DATE") {
            self.view = "TIME";
          } else {
            self.view = "DATE";

            if (self.selectedTabIndex === 0) {
              self.selectedTabIndex = 1;
            }
          }
          break;

        default:
          self.view = "DATE";

          if (self.selectedTabIndex === 0) {
            self.selectedTabIndex = 1;
          }
      }
    }

    function showCustomView() {
      self.showCustom = true;
      self.selectedTabIndex = 0;
    }

    function dateRangeSelected() {
      self.selectedTabIndex = 0;
      self.view = "DATE";
      self.showCustom = !!self.startShowCustomSettings;

      changeDate(self.startDate, self.endDate);
    }

    function startDateSelected(date) {
      self.startDate = pickerService.getDate(date);

      setNextView();
    }

    function endDateSelected(date, update) {
      self.endDate = pickerService.getDate(date);

      if (self.closeOnSelect && self.mode === "date") {
        changeDate(self.startDate, self.endDate, update);
      } else {
        setNextView();
      }
    }

    function setRange(startDate, endDate) {
      self.startDate = startDate;
      self.endDate = endDate;

      changeDate(self.startDate, self.endDate);
    }

    function changeDate(startDate, endDate, update) {
      let range = { startDate: startDate, endDate: endDate };

      self.selectedTabIndex = 0;
      self.view = "DATE";

      if (angular.isUndefined(update) || update === true) {
        pickerService.executeCallback(
          self.customId + ":rangePicker:close",
          range
        );
      }
      pickerService.executeCallback(
        self.customId + ":calendar:changeDate",
        range
      );

      checkListActive();
    }

    function cancel() {
      self.selectedTabIndex = 0;
      self.showCustom = false;

      pickerService.executeCallback(self.customId + ":rangePicker:close");
    }
  },
]);
