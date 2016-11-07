"use strict";

import {IController, IScope, IFilterService} from "angular";
import {Todo} from "./todo.intf";
import {StoreService} from "../services/store";

export class TodoController implements IController {

	public todoTitle: string;
	public todos: Todo[];
	public status: string;
	public statusFilter: any;

	public saveEvent: string;

	public saving: boolean;
	public originalTodo: Todo;
	public editedTodo: Todo;
	public reverted: boolean;

	public remainingCount: number;
	public completedCount: number;
	public allChecked: boolean;

	public $scope: IScope;
	public $filter: IFilterService;
	public store: StoreService;

	public static $inject: string[] = ["$scope", "$filter", "store"];

	public constructor($scope: IScope, $filter: IFilterService, store: StoreService) {
		this.$scope = $scope;
		this.$filter = $filter;
		this.store = store;
	}

	public $onInit(): void {
		this.todos = [];

		this.store.get().then(() => {
			this.todos = this.store.todos;
		});

		this.$scope.$watch("$ctrl.todos", () => {
			this.remainingCount = this.$filter("filter")(this.todos, {completed: false}).length;
			this.completedCount = this.todos.length - this.remainingCount;
			this.allChecked = !this.remainingCount;
		}, true);
	}

	public showAll(status: string): void {
		this.status = status || "";
		this.statusFilter = (status === "active") ?
		{completed: false} : (status === "completed") ?
		{completed: true} : {};
	}

	public addTodo(): void {
		let newTodo: Todo = {
			title: this.todoTitle.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		this.saving = true;
		this.store.insert(newTodo)
			.then(() => {
				this.todoTitle = "";
			})
			.finally(() => {
				this.saving = false;
			});
	}

	public editTodo(todo: Todo): void {
		this.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		this.originalTodo = angular.extend({}, todo);
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

		this.store[todo.title ? "put" : "delete"](todo)
			.then(() => {
				// nothing to do on success
			}, () => {
				todo.title = this.originalTodo.title;
			})
			.finally(() => {
				this.editedTodo = undefined;
			});
	};

	public revertEdits(todo: Todo): void {
		this.todos[this.todos.indexOf(todo)] = this.originalTodo;
		this.editedTodo = undefined;
		this.originalTodo = undefined;
		this.reverted = true;
	};

	public removeTodo(todo: Todo): void {
		this.store.delete(todo);
	};

	public saveTodo(todo: Todo): void {
		this.store.put(todo);
	};

	public toggleCompleted(todo: Todo, completed: boolean): void {
		if (angular.isDefined(completed)) {
			todo.completed = completed;
		}
		this.store.put(todo)
			.then(
				() => {
					// nothing to do on success
				}, () => {
					todo.completed = !todo.completed;
				});
	};

	public clearCompletedTodos(): void {
		let todos: Todo[] = this.todos.slice(0);

		todos.forEach((todo: Todo) => {
			if (todo.completed) {
				this.store.delete(todo);
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
