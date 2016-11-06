"use strict";

import {ILogService} from "angular";

import SinonStatic = Sinon.SinonStatic;
import SinonFakeServer = Sinon.SinonFakeServer;

let sinon: SinonStatic = require("sinon/pkg/sinon");
let fakeRest: any = require("fakerest");

let data: any = require("../../api/data.json");

export function fakeRestServerConfig($log: ILogService): void {
	$log.log("api data fetched", data);

	let apiUrl: string = "api";
	let skippedUrls: RegExp[] = [/\.html$/];

	let restServer: any = new fakeRest.Server(apiUrl);

	restServer.init(data);

	// logging is off by default, enable it to see network calls in the console
	restServer.toggleLogging();

	// use sinon.js to monkey-patch XmlHttpRequest
	let sinonServer: SinonFakeServer = sinon.fakeServer.create();
	sinonServer.autoRespond = true;
	sinonServer.autoRespondAfter = 150; // delay in milliseconds

	sinonServer["xhr"].useFilters = true;

	skippedUrls.forEach((skippedUrl: RegExp) => {

		sinonServer["xhr"].addFilter((method: string, url: string) => {
			//whenever this returns true the request will NOT be faked
			if (url.search(skippedUrl) >= 0) {
				$log.log("FakeRest server skipping request: " + url);
				return true;
			}

			return false;
		});

	});

	sinonServer.respondWith(restServer.getHandler());
	$log.log("FakeRest server started with url " + apiUrl);
}

fakeRestServerConfig.$inject = ["$log"];
