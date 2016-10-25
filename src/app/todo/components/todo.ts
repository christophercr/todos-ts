"use strict";

import {TodoController} from "./todoCtrl";

const templateContent = require("./todo.html");

export const todoComponent = {
	template: templateContent,
	controller: TodoController
};
