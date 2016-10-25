"use strict";

/**
 * Directive that executes an expression when the element it is applied to gets an `escape` keydown event.
 */
export class TodoEscapeDirective {

	public restrict = "A";
	public scope = false; // uses parent's scope

	public $log;

	public constructor($log) {
		this.$log = $log;
	}

	public link(scope, elem, attrs) {
		this.$log.log("todoEscape directive loaded");
		let ESCAPE_KEY = 27;

		elem.bind("keydown", (event) => {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs["todoEscape"]);
			}
		});

		scope.$on("$destroy", () => {
			elem.unbind("keydown");
		});
	}
}
