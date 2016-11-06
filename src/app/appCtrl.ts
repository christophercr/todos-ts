"use strict";

import {ILogService, IController} from "angular";

// controller
export class AppController implements IController {
	public $log: ILogService;

	public static $inject: string[] = ["$log"];

	public constructor($log: ILogService) {
		this.$log = $log;
		this.$log.debug("app - loading...");
	}

	public $onInit(): void {
		this.$log.debug("app - initialized");
	}
}
