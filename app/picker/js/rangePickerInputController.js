picker.controller("rangePickerInputController", [
  "$scope",
  "$timeout",
  "$element",
  "$mdUtil",
  "$mdMedia",
  "$document",
  "pickerService",
  "pickerProvider",
  function (
    $scope,
    $timeout,
    $element,
    $mdUtil,
    $mdMedia,
    $document,
    pickerService,
    pickerProvider
  ) {
    let self = this;

    self.isCalenderOpen = false;

    self.calenderHeight = 460;
    self.calenderWidth = 296;

    self.customId = $scope.customId || "one";

    self.inputPane = $element[0].querySelector(".sm-input-container");
    self.calenderPane = $element[0].querySelector(".sm-calender-pane");
    self.button = $element[0].querySelector(".sm-picker-icon");
    self.calenderPan = angular.element(self.calenderPane);
    self.calenderPan.addClass("hide hide-animate");

    self.mode = angular.isUndefined($scope.mode) ? "date" : $scope.mode;
    self.format = angular.isUndefined($scope.format)
      ? "DD/MM/YYYY"
      : $scope.format;
    self.divider = $scope.divider || "-";

    self.disabled = $scope.disabled;

    self.startDate = $scope.startDate;
    self.endDate = $scope.endDate;

    self.onRangeSelect = angular.isFunction($scope.onRangeSelect)
      ? $scope.onRangeSelect
      : false;

    self.customList = $scope.customList || null;

    self.closeOnSelect = !!$scope.closeOnSelect === true;

    self.bodyClickHandler = angular.bind(self, clickOutSideHandler);

    self.getVisibleViewPort = getVisibleViewPort;
    self.show = show;
    self.tabOutEvent = tabOutEvent;
    self.hideElement = hideElement;
    self.clickOutSideHandler = clickOutSideHandler;

    pickerService.registerCallback(
      self.customId + ":rangePicker:close",
      closePicker
    );

    (function () {
      $scope.$watchGroup(
        ["startDate", "endDate"],
        function (newValues, oldValues, scope) {
          let startDate = $scope.startDate
            ? pickerService.getDate($scope.startDate)
            : pickerProvider.startDate;
          let endDate = $scope.endDate
            ? pickerService.getDate($scope.endDate)
            : pickerProvider.endDate;

          initInput({ startDate: startDate, endDate: endDate });
        }
      );

      if (self.customList) {
        pickerProvider.rangeDefaultList = self.customList;
      }

      $scope.$on("$destroy", function () {
        if (self.calenderPane.parentNode) {
          self.calenderPane.parentNode.removeChild(self.calenderPane);
        }
      });

      angular.element(self.inputPane).on("keydown", function (e) {
        switch (e.which) {
          case 27:
          case 9:
            hideElement();
            break;
        }
      });
    })();

    function initInput(date) {
      self.value =
        date.startDate.format(self.format) +
        " " +
        self.divider +
        " " +
        date.endDate.format(self.format);
    }

    function getVisibleViewPort(elementRect, bodyRect) {
      let top = elementRect.top;
      if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
        top =
          elementRect.top -
          (elementRect.top + self.calenderHeight - (bodyRect.bottom - 20));
      }

      let left = elementRect.left;
      if (elementRect.left + self.calenderWidth > bodyRect.right) {
        left =
          elementRect.left -
          (elementRect.left + self.calenderWidth - (bodyRect.right - 10));
      }

      return {
        top: top,
        left: left,
      };
    }

    function show($event) {
      let elementRect = self.inputPane.getBoundingClientRect();
      let bodyRect = document.body.getBoundingClientRect();

      self.calenderPan.removeClass("hide hide-animate");

      if ($mdMedia("sm") || $mdMedia("xs")) {
        self.calenderPane.style.left = (bodyRect.width - 320) / 2 + "px";
        self.calenderPane.style.top = (bodyRect.height - 450) / 2 + "px";
      } else {
        let rect = getVisibleViewPort(elementRect, bodyRect);
        self.calenderPane.style.left = rect.left + "px";
        self.calenderPane.style.top = rect.top + "px";
      }

      document.body.appendChild(self.calenderPane);
      angular.element(self.calenderPane).focus();

      self.calenderPan.addClass("show");
      $mdUtil.disableScrollAround(self.calenderPane);

      self.isCalenderOpen = true;
      $timeout(function () {
        $document.on("click", self.bodyClickHandler);
      }, 200);
    }

    function tabOutEvent(element) {
      if (element.which === 9) {
        hideElement();
      }
    }

    function hideElement() {
      self.calenderPan.addClass("hide-animate");
      self.calenderPan.removeClass("show");

      $mdUtil.enableScrolling();

      if (self.button) {
        angular.element(self.button).focus();
      }

      $document.off("click");

      self.isCalenderOpen = false;

      $timeout(function () {
        if (self.isCalenderOpen === false) {
          if (self.calenderPane.parentNode) {
            self.calenderPane.parentNode.removeChild(self.calenderPane);
          }
        }
      });
    }

    function closePicker(date) {
      let startDate = date.startDate
        ? pickerService.getDate(date.startDate)
        : pickerProvider.startDate;
      let endDate = date.endDate
        ? pickerService.getDate(date.endDate)
        : pickerProvider.endDate;

      self.value =
        startDate.format(self.format) +
        " " +
        self.divider +
        " " +
        endDate.format(self.format);

      $document.off("keydown");
      hideElement();

      if (angular.isFunction(self.onRangeSelect)) {
        self.onRangeSelect({
          range: { startDate: startDate, endDate: endDate },
        });
      }
    }

    function clickOutSideHandler(e) {
      if (!self.button) {
        if (
          self.calenderPane !== e.target &&
          self.inputPane !== e.target &&
          !self.calenderPane.contains(e.target) &&
          !self.inputPane.contains(e.target)
        ) {
          hideElement();
        }
      } else {
        if (
          self.calenderPane !== e.target &&
          self.button !== e.target &&
          !self.calenderPane.contains(e.target) &&
          !self.button.contains(e.target)
        ) {
          hideElement();
        }
      }
    }
  },
]);
