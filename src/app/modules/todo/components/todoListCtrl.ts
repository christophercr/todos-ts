"use strict";

import {IController, IOnChangesObject} from "angular";
import {Todo} from "../services/todo.intf";

export class TodoListController implements IController {

	public todos: Todo[];
	public onSave: Function;
	public onDelete: Function;
	public onToggle: Function;

	public status: string;
	public statusFilter: any;

	public saveEvent: string;

	public originalTodo: Todo;
	public editedTodo: Todo;
	public reverted: boolean;

	public remainingCount: number;
	public completedCount: number;
	public allChecked: boolean;

	public static $inject: string[] = [];

	public constructor() {
		// ...
	}

	public $onChanges(onChangesObj: IOnChangesObject): void {
		console.log("--------", onChangesObj);
		if (onChangesObj["todos"]) {
			this.todos = onChangesObj["todos"].currentValue;

			this.remainingCount = this.todos.filter((todo:Todo) => todo.completed === false).length;
			this.completedCount = this.todos.length - this.remainingCount;
			this.allChecked = !this.remainingCount;
		}
	}

	public showAll(status: string): void {
		this.status = status || "";
		this.statusFilter = (status === "active") ?
		{completed: false} : (status === "completed") ?
		{completed: true} : {};
	}

	public editTodo(todo: Todo): void {
		this.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		this.originalTodo = Object.assign({}, todo);
	};

	public saveEdits(todo: Todo, event: string): void {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === "blur" && this.saveEvent === "submit") {
			this.saveEvent = undefined;
			return;
		}

		this.saveEvent = event;

		if (this.reverted) {
			// Todo edits were reverted-- don't save.
			this.reverted = false;
			return;
		}

		todo.title = todo.title.trim();

		if (todo.title === this.originalTodo.title) {
			this.editedTodo = undefined;
			return;
		}

		this.onSave({
			todo,
			originalTodo: this.originalTodo
		});

		this.editedTodo = undefined;
	};

	public revertEdits(todo: Todo): void {
		this.todos[this.todos.indexOf(todo)] = this.originalTodo;
		this.editedTodo = undefined;
		this.originalTodo = undefined;
		this.reverted = true;
	};

	public removeTodo(todo: Todo): void {
		this.onDelete({
			todo: todo
		});
	};

	public toggleCompleted(todo: Todo, completed: boolean): void {
		if (typeof completed !== "undefined") {
			todo.completed = completed;
		}

		this.onToggle({
			todo
		});
	};

	public clearCompletedTodos(): void {
		let todos: Todo[] = this.todos.slice(0);

		todos.forEach((todo: Todo) => {
			if (todo.completed) {
				this.removeTodo(todo);
			}
		});
	};

	public markAll(completed: boolean): void {
		this.todos.forEach((todo: Todo) => {
			if (todo.completed !== completed) {
				this.toggleCompleted(todo, completed);
			}
		});
	};
}
