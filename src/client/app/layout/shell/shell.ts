namespace app.layout {
    "use strict";
    export class ShellController {
      static $inject = ["$scope"];
      constructor(private $scope: ng.IScope) {

      }
    }

    angular.module("app.layout")
      .directive("shell", (): ng.IDirective => {
        return <ng.IDirective> {
          scope: {},
          templateUrl: "layout/shell/shell.html",
          controller: ShellController,
          controllerAs: "shellController"
        }
      });
}
