var app;
(function (app) {
    var layout;
    (function (layout) {
        "use strict";
        var ShellController = (function () {
            function ShellController($scope) {
                this.$scope = $scope;
            }
            ShellController.$inject = ["$scope"];
            return ShellController;
        })();
        layout.ShellController = ShellController;
        angular.module("app.layout")
            .directive("shell", function () {
            return {
                scope: {},
                templateUrl: "layout/shell/shell.html",
                controller: ShellController,
                controllerAs: "shellController"
            };
        });
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=shell.js.map