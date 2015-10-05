namespace app.model {
	"use strict";
	export class PeopleService {
		person: ng.resource.IResourceClass<IPerson>;
		static $inject = ["$resource"];
		constructor(private $resource: ng.resource.IResourceService) {
			this.person = $resource<IPerson>("/api/people");
		}
	}

	angular.module("app.model")
		.service("peopleService", PeopleService);
}
