"use strict";

import {IComponentOptions} from "angular";
import {TodoListController} from "./todoListCtrl";

const templateContent: string = require("./todoList.html");

export const todoListComponent: IComponentOptions = {
	template: templateContent,
	controller: TodoListController,
	bindings: {
		newTodo: "<", // one way binding // input
		todos: "<",   // one way binding // input
		onInsert: "&",  // function binding // output
		onSave: "&",    // function binding // output
		onDelete: "&",  // function binding // output
		onToggle: "&"   // function binding // output
	}
};
