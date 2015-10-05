var app;
(function (app) {
    var layout;
    (function (layout) {
        var people;
        (function (people) {
            "use strict";
            var PeopleController = (function () {
                function PeopleController() {
                }
                return PeopleController;
            })();
            people.PeopleController = PeopleController;
            angular.module("app.layout")
                .controller("peopleController", PeopleController);
        })(people = layout.people || (layout.people = {}));
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=people.controller.js.map