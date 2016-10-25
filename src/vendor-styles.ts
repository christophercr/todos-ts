"use strict";

// This is the entry point for vendor styles
// We've configured Webpack to consider this as an entry, which will trigger the creation of a specific bundle

// Stylesheets imported here will NOT be processed by PostCSS
// If a specific stylesheet needs auto-prefixing or other processing by PostCSS then you should import it from vendor.scss instead
import "../node_modules/angular-material/angular-material.css";
import "../node_modules/todomvc-common/base.css";
import "../node_modules/todomvc-app-css/index.css";

// import vendor stylesheets (those that need auto-prefixing)
import "./app/css/vendor.scss";
