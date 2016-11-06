"use strict";

import {IModule, ILogService} from "angular";

import {fakeRestServerConfig} from "./fake-rest-server.run";

import {AppController} from "./appCtrl";

import {todoModule} from "./modules/todo/module";

const template: string = require("./app.html");

export class App {
	public appModule: IModule;

	public constructor() {

		this.appModule = angular.module("appModule", [
			todoModule.name
		]);

		this.appModule
			.component("app", {
				controller: AppController,
				template: template
			});

		this.appModule.run(fakeRestServerConfig);

		this.appModule.run(["$log", ($log: ILogService) => {
			$log.debug("Application running");
		}]);
	}

	/**
	 * Method responsible for actually bootstrapping the app.
	 */
	public bootstrapApp(): void {
		// Enabling "StrictDI" mode to enforce explicit annotations in injectable functions
		// https://docs.angularjs.org/guide/production#disabling-debug-data
		angular.bootstrap(document, [this.appModule.name], {
			strictDi: true
		});
	}
}
