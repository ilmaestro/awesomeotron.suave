var app;
(function (app) {
    'use strict';
    var ShellController = (function () {
        function ShellController($scope) {
            this.$scope = $scope;
        }
        ShellController.$inject = ["$scope"];
        return ShellController;
    })();
    app.ShellController = ShellController;
    angular.module('app.layout')
        .directive("shell", function () {
        return {
            scope: {},
            templateUrl: "layout/shell.html",
            controller: ShellController,
            controllerAs: "shellController"
        };
    });
})(app || (app = {}));
//# sourceMappingURL=shell.js.map