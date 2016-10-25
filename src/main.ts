"use strict";

// import the app, the top level component of our application
import {App} from "./app/app";

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection system
 */
class Main {
	public main():void {
		console.log("Bootstrapping the App...");
		const app:App = new App();
		app.bootstrapApp();

		if(PRODUCTION) {
			// We only import the application styles here for the production build
			// In development, main-styles.ts takes care of that (separate bundle)
			require("./main-styles");
		}
	}

	/**
	 * Call the main function once the DOM has loaded
     */
	private bootstrapDomReady():void {
		document.addEventListener("DOMContentLoaded", this.main);
	}

	public bootstrap():void {
		/**
		 * Bootstrap after document is ready
		 * @returns {void}
		 */
		if (DEVELOPMENT) {
			console.log("Development environment");

			// activate Hot Module Replacement (HMR)
			if (HMR) {
				if (document.readyState === "complete") {
					this.main();
				} else {
					this.bootstrapDomReady();
				}
				module.hot.accept();
			} else {
				this.bootstrapDomReady();
			}
		} else {
			this.bootstrapDomReady();
		}
	}
}

const main:Main = new Main();
main.bootstrap();
