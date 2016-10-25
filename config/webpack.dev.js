"use strict";

const webpack = require("webpack");

const webpackMerge = require("webpack-merge"); // Used to merge webpack configs
const commonConfig = require("./webpack.common.js"); // common configuration between environments

// Helpers
const helpers = require("./helpers");

// Webpack Plugins
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

// Metadata
const METADATA = {
	HOST: process.env.HOST || "localhost",
	PORT: process.env.PORT || 3000,
	ENV: process.env.ENV = process.env.NODE_ENV = "development",
	HMR: helpers.hasProcessFlag("hot"),
	PRODUCTION: false,
	DEVELOPMENT: true,
};

// Directives to be used in CSP header
const cspDirectives = [
	"base-uri 'self'",
	"default-src 'self'",
	"child-src 'self'",
	"connect-src 'self'",
	"font-src 'self'",
	"form-action 'self'",
	"frame-src 'self'",   // deprecated. Use child-src instead. Used here because child-src is not yet supported by Firefox. Remove as soon as it is fully supported
	"frame-ancestors 'none'",  // the app will not be allowed to be embedded in an iframe (roughly equivalent to X-Frame-Options: DENY)
	"img-src 'self' data: image/png",  // data: image/png" is due to Angular Material loading PNG images in base64 encoding
	"media-src 'self'",
	"object-src 'self'",
	"plugin-types application/pdf",  // valid mime-types for plugins invoked via <object> and <embed>
	// 'unsafe-eval' is due to FakeRest and Angular Material inline theming (see issues:  https://github.com/marmelab/FakeRest/issues/23 and https://github.com/angular/material/issues/980)
	// once fixed for Angular Material, also remove it from superstatic.json (production build executed locally)
	"script-src 'self' 'unsafe-eval'",
	"style-src 'self'" // We define the same nonce value via the $mdThemingProvider (https://material.angularjs.org/HEAD/api/service/$mdThemingProvider)
];


/*
 * Config
 * IMPORTANT: notice that the configuration below is MERGED with the common configuration (commonConfig)
 * reference: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackMerge(commonConfig, {
	// static data for index.html
	metadata: METADATA,

	// Developer tool to enhance debugging
	// reference: https://webpack.github.io/docs/configuration.html#devtool
	// reference: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
	devtool: "source-map",

	// Cache generated modules and chunks to improve performance for multiple incremental builds.
	// Enabled by default in watch mode.
	// You can pass false to disable it
	// reference: http://webpack.github.io/docs/configuration.html#cache
	//cache: true,

	// Switch loaders to debug mode
	// reference: http://webpack.github.io/docs/configuration.html#debug
	debug: true,

	// the entry point for the bundles
	// reference: http://webpack.github.io/docs/configuration.html#entry
	entry: {
		// main entries
		"polyfills": helpers.root("src/polyfills.ts"),
		"vendor-styles": helpers.root("src/vendor-styles.ts"),
		"main-styles": helpers.root("src/main-styles.ts"), // our angular app's styles. Useful only changing the styles bundle while working on styling
		"vendor": helpers.root("src/vendor.ts"),
		"main": helpers.root("src/main.ts"), // our angular app
	},

	// Options affecting the normal modules.
	// reference: http://webpack.github.io/docs/configuration.html#module
	module: {
		// An array of automatically applied loaders.
		//
		// IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
		// This means they are not resolved relative to the configuration file.
		//
		// reference: http://webpack.github.io/docs/configuration.html#module-loaders
		loaders: [
			// Support for .ts files.
			// reference: https://github.com/s-panferov/awesome-typescript-loader
			{
				test: /\.ts$/,
				loader: "ts",
				exclude: [
					/\.e2e-spec\.ts$/, // exclude end-to-end tests
					/\.spec\.ts$/, // exclude unit tests
				],
			},
		],
	},

	// Add additional plugins to the compiler.
	// reference: http://webpack.github.io/docs/configuration.html#plugins
	plugins: [
		// Environment helpers (when adding more properties make sure you include them in environment.d.ts)
		// Plugin: DefinePlugin
		// Description: Define free variables.
		// Useful for having development builds with debug logging or adding global constants.
		// reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
		// NOTE: when adding more properties make sure you include them in custom-typings.d.ts
		new webpack.DefinePlugin({
			"ENV": JSON.stringify(METADATA.ENV),
			"NODE_ENV": JSON.stringify(METADATA.ENV),
			"HMR": METADATA.HMR,
			"PRODUCTION": METADATA.PRODUCTION,
			"DEVELOPMENT": METADATA.DEVELOPMENT,
			"process.env": {
				"ENV": JSON.stringify(METADATA.ENV),
				"NODE_ENV": JSON.stringify(METADATA.ENV),
				"HMR": METADATA.HMR,
				"PRODUCTION": METADATA.PRODUCTION,
				"DEVELOPMENT": METADATA.DEVELOPMENT,
			},
		}),

		// Plugin: CommonsChunkPlugin
		// Description: Shares common code between the pages.
		// It identifies common modules and put them into a commons chunk.
		// reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
		// reference: https://github.com/webpack/docs/wiki/optimization#multi-page-app
		new webpack.optimize.CommonsChunkPlugin({
			name: helpers.reverse([
				"polyfills",
				"vendor",
				"main",
				"vendor-styles",
				"main-styles",
			]),
			// the filename configured in the output section is reused
			//filename: "[name].[hash].bundle.js",
			chunks: Infinity,
		}),

		// Plugin: ExtractTextWebpackPlugin
		// Description: Extract css file contents
		// reference: https://github.com/webpack/extract-text-webpack-plugin
		// notice that in DEV we do not add hashes to the stylesheet file names
		new ExtractTextWebpackPlugin("[name].css", {
			disable: false,
		})
	],

	// Webpack Development Server configuration
	// Description: The webpack-dev-server is a little node.js Express server.
	// The server emits information about the compilation state to the client,
	// which reacts to those events.
	// reference: https://webpack.github.io/docs/webpack-dev-server.html
	devServer: {
		
		port: METADATA.PORT,
		host: METADATA.HOST,

		// HTML5 History API support: no need for # in URLs
		// automatically redirect 404 errors to the index.html page
		// uses connect-history-api-fallback behind the scenes: https://github.com/bripkens/connect-history-api-fallback
		// reference: http://jaketrent.com/post/pushstate-webpack-dev-server/
		historyApiFallback: true,

		// file watch configuration
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
		},
		contentBase: helpers.root("dist"), // necessary so that all the content is available

		// Can be used to add specific headers
		headers: {
			// enable CORS
			"Access-Control-Allow-Origin": "*",

			// CSP header (and its variants per browser)
			// "Content-Security-Policy": cspDirectives.join("; "),
			// "X-Content-Security-Policy": cspDirectives.join("; "),
			// "X-WebKit-CSP": cspDirectives.join("; "),

			// Other security headers

			// protect against clickjacking: https://en.wikipedia.org/wiki/Clickjacking
			// reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options
			"X-Frame-Options": "deny",

			// enable some protection against XSS
			// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
			"X-Xss-Protection": "1; mode=block",

			// protect against drive-by download attacks and user uploaded content that could be treated by Internet Explorer as executable or dynamic HTML files
			// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
			"X-Content-Type-Options": "nosniff",
		},
	},
});

// Configure live reloading
// By default, if Hot Module Replacement (HMR) is enabled and the --inline flag is passed to Webpack
// then id adds the following bundle as entry: https://github.com/webpack/webpack/blob/master/hot/dev-server.js
// that script takes care of HMR but reloads the whole page when HMR does not work (e.g., when a stylesheet changes)

// With the following, if HMR is enabled but --inline was not specified, we disable the page reloads for cases when HMR does not work
// reference: https://github.com/webpack/webpack/issues/418

if(helpers.hasProcessFlag("hot")){
	if(!helpers.hasProcessFlag("inline")) {
		// adds the following script: https://github.com/webpack/webpack/blob/master/hot/only-dev-server.js
		// that script handles HMR but does NOT force a page reload
		module.exports.entry["webpack-dev-server"] = helpers.root("node_modules/webpack/hot/only-dev-server");
	}	
}
