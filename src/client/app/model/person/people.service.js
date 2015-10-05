var app;
(function (app) {
    var model;
    (function (model) {
        "use strict";
        var PeopleService = (function () {
            function PeopleService($resource) {
                this.$resource = $resource;
                this.person = $resource("/api/people");
            }
            PeopleService.$inject = ["$resource"];
            return PeopleService;
        })();
        model.PeopleService = PeopleService;
        angular.module("app.model")
            .service("peopleService", PeopleService);
    })(model = app.model || (app.model = {}));
})(app || (app = {}));
//# sourceMappingURL=people.service.js.map