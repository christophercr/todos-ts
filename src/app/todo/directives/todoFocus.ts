"use strict";

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
export class TodoFocusDirective {
	public restrict = "A";
	public scope = false; // uses parent's scope

	public $log;
	public $timeout;

	public constructor($log, $timeout) {
		this.$log = $log;
		this.$timeout = $timeout;
	}

	public link(scope, elem, attrs) {
		this.$log.log("todoFocus directive loaded");

		scope.$watch(attrs["todoFocus"], (newVal) => {
			if (newVal) {
				this.$timeout(() => {
					elem[0].focus();
				}, 0, false);
			}
		});
	}
}
