"use strict";

import {IDirective, IScope, ILogService, ITimeoutService, IAugmentedJQuery, IAttributes} from "angular";

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
export class TodoFocusDirective implements IDirective {
	public restrict: string = "A";
	public scope: boolean = false; // uses parent's scope

	public $log: ILogService;
	public $timeout: ITimeoutService;

	public constructor($log: ILogService, $timeout: ITimeoutService) {
		this.$log = $log;
		this.$timeout = $timeout;
	}

	public link(scope: IScope, elem: IAugmentedJQuery, attrs: IAttributes): void {
		this.$log.log("todoFocus directive loaded");

		scope.$watch(attrs["todoFocus"], (newVal: any) => {
			if (newVal) {
				this.$timeout(() => {
					elem[0].focus();
				}, 0, false);
			}
		});
	}
}
