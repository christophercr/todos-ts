"use strict";

import {IController, IOnChangesObject} from "angular";
import {Todo} from "../services/todo.intf";

export class AddTodoController implements IController {

	public newTodo: Todo;
	public onInsert: Function;

	public saving: boolean;

	public static $inject: string[] = [];

	public constructor() {
		// ...
	}

	public $onChanges(onChangesObj: IOnChangesObject): void {
		console.log("--------", onChangesObj);
		if (onChangesObj["newTodo"]) {
			this.newTodo = onChangesObj["newTodo"].currentValue;
		}
	}

	public addTodo(): void {
		this.newTodo.title.trim();

		if (!this.newTodo.title) {
			return;
		}

		this.saving = true;

		this.onInsert({
			todo: this.newTodo
		});

		this.saving = false;
	}
}
