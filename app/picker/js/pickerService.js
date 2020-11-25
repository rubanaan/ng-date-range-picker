picker.service("pickerService", function () {
  let self = this;
  let callbacks = {};

  self.registerCallback = registerCallback;
  self.executeCallback = executeCallback;
  self.getDate = getDate;

  function registerCallback(name, callback) {
    callbacks[name] = callback;
  }

  function executeCallback(name, first, second) {
    if (angular.isFunction(callbacks[name])) {
      let args = [].splice.call(arguments, 0);

      args.splice(0, 1);

      callbacks[name].apply(null, args);
    }
  }

  function getDate(date) {
    if (!date) {
      return null;
    }

    if (moment.isMoment(date)) {
      return date;
    }

    if (!moment.isMoment(date)) {
      return moment.unix(date);
    }

    return null;
  }
});
