"use strict";

// controller
export class AppController {
	public $log;

	public static $inject = ["$log"];

	public constructor($log) {
		this.$log = $log;
		this.$log.debug("app - loading...");
	}

	public $onInit() {
		this.$log.debug("app - initialized");
	}
}
