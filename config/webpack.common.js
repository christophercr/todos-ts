"use strict";

const webpack = require("webpack");

// Helpers
const helpers = require("./helpers");

// Webpack Plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");
const WebpackSHAHash = require("webpack-sha-hash");

// Metadata
const METADATA = {
    title: "AngularJS Todos TS",
    description: "AngularJS todos using Typescript and Webpack",
    baseUrl: "/",
};

/*
 * Config
 * reference: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

	// static data for index.html
    metadata: METADATA,

	stats: {
		colors: true,
		reasons: true,
	},

	// Options affecting the output of the compilation
	// reference: http://webpack.github.io/docs/configuration.html#output
	output: {
		// Mandatory but not actually useful since everything remains in memory with webpack-dev-server
		// reference: http://webpack.github.io/docs/configuration.html#output-path
		path: helpers.root("dist"),
		// We need to tell Webpack to serve our bundled application
		// from the build path. When proxying:
		// http://localhost:3000/ -> http://localhost:8080/
		publicPath: "/",
		// Adding hashes to files for cache busting
		// IMPORTANT: You must not specify an absolute path here!
		// reference: http://webpack.github.io/docs/configuration.html#output-filename
		filename: "[name].[hash].bundle.js",
		// The filename of the SourceMaps for the JavaScript files.
		// They are inside the output.path directory.
		// reference: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
		sourceMapFilename: "[name].[hash].map",
		// The filename of non-entry chunks as relative path
		// inside the output.path directory.
		// reference: http://webpack.github.io/docs/configuration.html#output-chunkfilename
		chunkFilename: "[id].[hash].chunk.js",
	},

	// Options affecting the resolving of modules.
	// reference: http://webpack.github.io/docs/configuration.html#resolve
	resolve: {
		cache: false,
		// an array of extensions that should be used to resolve modules.
		// reference: http://webpack.github.io/docs/configuration.html#resolve-extensions
		extensions: [ "", ".ts", ".js", ".json", ".css", ".scss", ".html" ],

		// Make sure that Webpack's root includes all the sources
		root: [
			helpers.root("src")
		],

		// Remove other default values
		// can be used to configure all locations where Webpack's module resolver will look for modules
		modulesDirectories: [
			helpers.root("node_modules")
		],		
		
		fallback:[
			"node_modules"
		],
	},

	// Webpack's loader loading configuration
	// reference: http://webpack.github.io/docs/configuration.html#resolveloader
	resolveLoader: {

		// Where Webpack looks for loaders
		// can be customized so that Webpack can find loaders in other locations 
		modulesDirectories: [
			helpers.root("node_modules")
		],
		fallback:["node_modules"],

		// default values kept
		extensions: ["", ".webpack-loader.js", ".web-loader.js", ".loader.js", ".js"],
		packageMains: ["webpackLoader", "webLoader", "loader", "main"],
		
	},

	// Options affecting the normal modules.
	// reference: http://webpack.github.io/docs/configuration.html#module
	module: {
		// things that should not be parsed
		noParse: [
			// ...
		],

		// An array of applied pre and post loaders.
		// reference: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
		preLoaders: [
			// TsLint loader support for *.ts files
			// reference: https://github.com/wbuchwalter/tslint-loader
			{
				test: /\.ts$/,
				loader: "tslint",
				exclude: [
					helpers.root("node_modules")
				]
			},

			// Source map loader support for *.js files
			// Extracts SourceMaps for source files that as added as sourceMappingURL comment.
			// reference: https://github.com/webpack/source-map-loader
			{
				test: /\.js$/,
				loader: "source-map",
				exclude: [
					helpers.root("node_modules/rxjs")
				],
			},
		],

		// An array of automatically applied loaders.
		//
		// IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
		// This means they are not resolved relative to the configuration file.
		//
		// reference: http://webpack.github.io/docs/configuration.html#module-loaders
		loaders: [
			// Support for *.json files
			{
				test: /\.json$/,
				loader: "json",
			},

			// Support for CSS as raw text
			// reference: https://github.com/webpack/raw-loader
			{
				test: /\.css$/,
				loader: ExtractTextWebpackPlugin.extract("raw"),
			},

			// Support for PostCSS
			{
				test: /\.scss$/,
				loader: ExtractTextWebpackPlugin.extract("style", "css?sourceMap!postcss?sourceMap")
			},

			// Support for .html
			{
				test: /\.html$/,
				loaders: [
					"html"
				],
				exclude: [
					helpers.root("src/index.html"),
				],
			},

			// Sinon.js
			{
				test: /sinon\.js$/,
				loader: "imports?define=>false,require=>false",
			},
		],

		// Post processors
		postLoaders: [
			// ...
		],
	},

	// Add additional plugins to the compiler.
	// reference: http://webpack.github.io/docs/configuration.html#plugins
	plugins: [
		// Plugin: NoErrorsPlugin
		// Description: Only emit files when there are no errors.
		// reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
		new webpack.NoErrorsPlugin(),

		// Plugin: ForkCheckerPlugin
		// Description: Do type checking in a separate process, so webpack don't need to wait.
		// reference: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
		//new ForkCheckerPlugin(),

		// Plugin: CopyWebpackPlugin
		// Description: Copy files and directories in webpack.
		// Copies project static assets.
		// reference: https://www.npmjs.com/package/copy-webpack-plugin
		new CopyWebpackPlugin([
			
			// Application assets
			{
				from: helpers.root("src/assets"),
				to: "assets",
			},
			// those assets are copied to the root of the target folder
			{
				from: helpers.root("src/assets-base"),
				to: "",
			},
		], {
			ignore: [
					"*.txt",
					"*.json",
					"*.md",
			],
			
			// By default the plugin only copies modified files during
			// a watch or webpack-dev-server build
			// Setting this to true copies all files
			// copyUnmodified: true
		}),

		// Plugin: CopyWebpackPlugin
		// Description: Copy files and directories in webpack.
		// Copies project static assets.
		// reference: https://www.npmjs.com/package/copy-webpack-plugin
		new CopyWebpackPlugin([

			// Application assets
			{
				from: helpers.root("src/assets/translations"),
				to: "assets/translations"
			},
		], {}),

		// Plugin: HtmlWebpackPlugin
		// Description: Simplifies creation of HTML files to serve your webpack bundles.
		// This is especially useful for webpack bundles that include a hash in the filename
		// which changes every compilation.
		// reference: https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: helpers.root("src/index.html"),
			chunksSortMode: helpers.packageSort([
				"polyfills",
				"vendor",
				"main",
			]),
		}),

		// Plugin: WebpackSHAHash
		// Description: Generate SHA content hashes
		new WebpackSHAHash(),
	],

	// typescript loader configuration
	// reference: https://github.com/TypeStrong/ts-loader
	ts: {
		// Allows you to specify a custom configuration file
		// here we make sure that the tsconfig.json file of the project itself is used and not another one
		configFileName: "tsconfig.json",
		
		// If you want to speed up compilation significantly you can set this flag.
		// However, many of the benefits you get from static type checking between different dependencies in your application will be lost. 
		// You should also set the isolatedModules TypeScript option if you plan to ever make use of this.
		transpileOnly: false,
		
		// If true, no console.log messages will be emitted. Note that most error messages are emitted via webpack which is not affected by this flag
		silent: false,
		
		ignoreDiagnostics: [],
		
		// Allows use of TypeScript compilers other than the official one. Should be set to the NPM name of the compiler
		//compiler: "typescript",
		
		// Allows overriding TypeScript options. Should be specified in the same format as you would do for the compilerOptions property in tsconfig.json.
		compilerOptions: {},
		
		// Advanced option to force files to go through different instances of the TypeScript compiler. Can be used to force segregation between different parts of your code.
		//instance: "..."
	},

	// TSLint configuration
	// Static analysis linter for TypeScript advanced options configuration
	// Description: An extensible linter for the TypeScript language.
	// reference: https://github.com/wbuchwalter/tslint-loader
	tslint: {

		// TSLint errors are displayed by default as warnings
		// set emitErrors to true to display them as errors
		emitErrors: false,

		// TSLint does not interrupt the compilation by default
		// if you want any file with tslint errors to fail
		// set failOnHint to true
		failOnHint: false,

		resourcePath: helpers.root("src"),

		// can be used to customize the path to the directory containing formatter (optional)
		//formattersDirectory: helpers.root("node_modules/tslint-loader/formatters/"),
	},
	
	// Include polyfills or mocks for various node stuff
	// Description: Node configuration
	// reference: https://webpack.github.io/docs/configuration.html#node
	node: {
		global: "window",
		process: false,
		crypto: "empty",
		module: false,
		clearImmediate: false,
		setImmediate: false,
	},

	// PostCSS plugins configuration
	// Reference: https://github.com/postcss/postcss
	postcss: (webpack) => {
		return [
			//https://github.com/postcss/postcss-import
			require("postcss-import")({ addDependencyTo: webpack }),
			// plugin to rebase, inline or copy on url().
			// https://github.com/postcss/postcss-url
			require("postcss-url")(),
			require('postcss-nesting')(),
			require('postcss-simple-extend')(),
			require("postcss-cssnext")({
				browsers: [ "last 3 versions" ]
			})
		]
	},
};
