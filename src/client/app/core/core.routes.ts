namespace app.core {
  "use strict";

    angular
        .module('app.core')
        .config(configureStates)
        .run(appRun);

    appRun.$inject = [];
    function appRun() { }

    configureStates.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
    /* @ngInject */
    function configureStates($stateProvider: ng.ui.IStateProvider,
        $locationProvider: ng.ILocationProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider) {
        var otherwise = '/404';
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
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
}
