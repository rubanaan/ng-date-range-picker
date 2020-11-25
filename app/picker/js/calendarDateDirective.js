picker.directive("calendarDate", function () {
  return {
    restrict: "E",
    replace: false,
    require: ["^ngModel", "calendarDate"],
    scope: {
      customId: "@",
      rangePickType: "@",
      minDate: "=",
      maxDate: "=",
      initialDate: "=",
      format: "@",
      mode: "@",
      startView: "@",
      weekStartDay: "@",
      disableYearSelection: "@",
    },
    controller: "calendarDateController",
    controllerAs: "vm",
    templateUrl: "picker/calender-date.html",
  };
});
