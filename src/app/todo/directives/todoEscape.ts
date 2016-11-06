"use strict";

import {IDirective, ILogService, IScope, IAugmentedJQuery, IAttributes} from "angular";

/**
 * Directive that executes an expression when the element it is applied to gets an `escape` keydown event.
 */
export class TodoEscapeDirective implements IDirective {

	public restrict: string = "A";
	public scope: boolean = false; // uses parent's scope

	public $log: ILogService;

	public constructor($log: ILogService) {
		this.$log = $log;
	}

	public link(scope: IScope, elem: IAugmentedJQuery, attrs: IAttributes): void {
		this.$log.log("todoEscape directive loaded");
		const ESCAPE_KEY: number = 27;

		elem.bind("keydown", (event: JQueryEventObject) => {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs["todoEscape"]);
			}
		});

		scope.$on("$destroy", () => {
			elem.unbind("keydown");
		});
	}
}
