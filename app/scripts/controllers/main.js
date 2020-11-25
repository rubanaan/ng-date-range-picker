testApp.controller("MainCtrl", [
  "$timeout",
  function MainCtrl($timeout) {
    let self = this;

    self.startDate = moment().startOf("month").unix();
    self.endDate = moment().endOf("month").unix();

    self.test = false;

    self.test = true;

    $timeout(function () {
      self.endDate = moment().unix();
      self.startDate = moment().unix();
    }, 1200);

    self.dayofPaySelected = function (range) {
      console.log(range);
    };
  },
]);
