"use strict";

import {IComponentOptions} from "angular";
import {TodoController} from "./todoCtrl";

const templateContent: string = require("./todo.html");

export const todoComponent: IComponentOptions = {
	template: templateContent,
	controller: TodoController
};
