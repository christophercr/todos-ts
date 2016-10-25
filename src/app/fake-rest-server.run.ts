"use strict";

let sinon = require("sinon/pkg/sinon");
let fakeRest = require("fakerest");

let data = require("../api/data.json");

export function fakeRestServerConfig($log) {
	$log.log("api data fetched", data);

	let apiUrl = "api";
	let skippedUrls = [/\.html$/];

	let restServer = new fakeRest.Server(apiUrl);

	restServer.init(data);

	// logging is off by default, enable it to see network calls in the console
	restServer.toggleLogging();

	// use sinon.js to monkey-patch XmlHttpRequest
	let sinonServer = sinon.fakeServer.create();
	sinonServer.autoRespond = true;
	sinonServer.autoRespondAfter = 150; // delay in milliseconds

	sinonServer["xhr"].useFilters = true;

	skippedUrls.forEach((skippedUrl) => {

		sinonServer["xhr"].addFilter((method, url) => {
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
