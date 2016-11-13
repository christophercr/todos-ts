"use strict";

import {IComponentOptions} from "angular";
import {AddTodoController} from "./addTodoCtrl";

const templateContent: string = require("./addTodo.html");

export const addTodoComponent: IComponentOptions = {
	template: templateContent,
	controller: AddTodoController,
	bindings: {
		newTodo: "<", // one way binding // input
		onInsert: "&"  // function binding // output
	}
};
