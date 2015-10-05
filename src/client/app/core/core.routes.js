var app;
(function (app) {
    var core;
    (function (core) {
        "use strict";
        angular
            .module("app.core")
            .config(configureStates)
            .run(appRun);
        appRun.$inject = [];
        function appRun() { }
        configureStates.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
        /* @ngInject */
        function configureStates($stateProvider, $locationProvider, $urlRouterProvider) {
            var otherwise = "/404";
            var states = getStates();
            states.forEach(function (state) {
                $stateProvider.state(state.state, state.config);
            });
            $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise(otherwise);
        }
        function getStates() {
            return [
                {
                    state: "404",
                    config: {
                        url: "/404",
                        templateUrl: "core/404.html",
                        title: "404"
                    }
                },
                {
                    state: "people",
                    config: {
                        url: "/people",
                        template: "layout/people/people.html",
                        title: "People",
                        controller: app.layout.People.PeopleController
                    }
                }
            ];
        }
    })(core = app.core || (app.core = {}));
})(app || (app = {}));
//# sourceMappingURL=core.routes.js.map