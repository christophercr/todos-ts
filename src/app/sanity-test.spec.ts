"use strict";

import {ILogService} from "angular";

describe("sanity checks", () => {

	let $log:ILogService = undefined;

	beforeEach(inject((_$log_:ILogService) => {
		$log = _$log_;
	}));

	it("should be able to test", () => {
		expect(true).toBe(true);
	});

	it("should inject angular mock services correctly", () => {
		expect($log).not.toBeNull();
		expect($log).not.toBeUndefined();
	});

	xit("should skip this", () => {
		expect(4).toEqual(40);
	});
});
