"use strict";

import {IController} from "angular";
import {StoreService} from "../services/store";
import {Todo} from "../services/todo.intf";

export class TodosPageController implements IController {

	public store: StoreService;
	public todos: Todo[];
	public newTodo: Todo;

	public static $inject: string[] = ["store"];

	public constructor(store: StoreService) {
		this.store = store;
	}

	public $onInit(): void {
		this.todos = [];
		this.newTodo = {
			title: "",
			completed: false
		};

		this.fetchTodos();
	}

	private fetchTodos(): void {
		this.store.get().then(() => {
			this.todos = this.store.todos;
		});
	}

	public insertTodo(todo: Todo): void {
		this.store.insert(todo)
			.then(() => {
				this.fetchTodos();
				// re-initialize newTodo
				this.newTodo = {
					title: "",
					completed: false
				};
			});
	}

	public saveTodo(todo: Todo, originalTodo: Todo): void {
		this.store[todo.title ? "put" : "delete"](todo)
			.then(() => {
				this.fetchTodos();
			}, () => {
				todo.title = originalTodo.title;
			});
	}

	public deleteTodo(todo: Todo): void {
		this.store.delete(todo)
			.then(() => {
				this.fetchTodos();
			});
	}

	public toggleTodo(todo: Todo): void {
		this.store.put(todo)
			.then(() => {
				this.fetchTodos();
				// nothing to do on success
			}, () => {
				todo.completed = !todo.completed;
			});
	}
}
