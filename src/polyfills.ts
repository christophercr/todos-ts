"use strict";

// Polyfills

// Added parts of es6 which are necessary for your project or your browser support requirements.
import "core-js/es6";
import "core-js/es7";

if (DEVELOPMENT) {
	// Ensure that we get detailed stack tracks during development (useful with node & Webpack)
	// Reference: http://stackoverflow.com/questions/7697038/more-than-10-lines-in-a-node-js-stack-error
	Error.stackTraceLimit = Infinity;
} else if (PRODUCTION) {
	// ...
} else {
	// ...
}
