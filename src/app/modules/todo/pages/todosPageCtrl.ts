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
		this.store.get().subscribe(
			() => { // next()
				this.todos = this.store.todos;
			}
		);
	}

	public insertTodo(todo: Todo): void {
		this.store.insert(todo).subscribe(
			() => { // next()
				this.fetchTodos();
				// re-initialize newTodo
				this.newTodo = {
					title: "",
					completed: false
				};
			}
		);
	}

	public saveTodo(todo: Todo, originalTodo: Todo): void {
		this.store[todo.title ? "put" : "delete"](todo).subscribe(
			() => { // next()
				this.fetchTodos();
			},
			() => { // error()
				todo.title = originalTodo.title;
			}
		);
	}

	public deleteTodo(todo: Todo): void {
		this.store.delete(todo).subscribe(
			() => { // next()
				this.fetchTodos();
			}
		);
	}

	public toggleTodo(todo: Todo): void {
		this.store.put(todo).subscribe(
			() => { // next()
				this.fetchTodos();
				// nothing to do on success
			},
			() => { // error()
				todo.completed = !todo.completed;
			}
		);
	}
}
