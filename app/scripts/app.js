var modules = [
  "ngAnimate",
  "ui.router",
  "ngMessages",
  "ngMaterial",
  "ngDateRangePicker",
];

var testApp = angular.module("testApp", modules);

testApp.run([
  "$http",
  "$templateCache",
  function ($http, $templateCache) {
    $http.get("views/messages.html").then(function (response) {
      $templateCache.put("error-messages", response.data);
    });
  },
]);

testApp.config([
  "$stateProvider",
  "$urlRouterProvider",
  "$mdThemingProvider",
  function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider.state("home", {
      url: "/home",
      templateUrl: "views/home.html",
      controller: "MainCtrl",
      controllerAs: "vm",
      data: {
        title: "Dashboard",
      },
    });

    $mdThemingProvider.theme("default").primaryPalette("green");
  },
]);
