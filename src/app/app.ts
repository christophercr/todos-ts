"use strict";

import {IModule, ILogService, ITimeoutService} from "angular";

import {fakeRestServerConfig} from "./fake-rest-server.run";

import {StoreService} from "./todo/services/store";
import {todoComponent} from "./todo/components/todo";
import {TodoEscapeDirective} from "./todo/directives/todoEscape";
import {TodoFocusDirective} from "./todo/directives/todoFocus";
import {AppController} from "./appCtrl";

const template: string = require("./app.html");

export class App {
	public appModule: IModule;

	public constructor() {

		this.appModule = angular.module("appModule", []);

		this.appModule
			.component("app", {
				controller: AppController,
				template: template
			})

			.component("todo", todoComponent)

			.directive("todoEscape", ["$log", ($log: ILogService) => new TodoEscapeDirective($log)])
			.directive("todoFocus", ["$log", "$timeout", ($log: ILogService, $timeout: ITimeoutService) => new TodoFocusDirective($log, $timeout)])

			.service("store", StoreService);

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
