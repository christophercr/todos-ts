"use strict";

export class TodoController {

	public todos;
	public status;
	public statusFilter;

	public saveEvent;

	public saving;
	public newTodo;
	public originalTodo;
	public editedTodo;
	public reverted;

	public remainingCount;
	public completedCount;
	public allChecked;

	public $scope;
	public $filter;
	public store;

	public static $inject = ["$scope", "$filter", "store"];

	public constructor($scope, $filter, store) {
		this.$scope = $scope;
		this.$filter = $filter;
		this.store = store;
	}

	public $onInit() {
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

	public showAll(status) {
		this.status = status || "";
		this.statusFilter = (status === "active") ?
		{completed: false} : (status === "completed") ?
		{completed: true} : {};
	}

	public addTodo() {
		let newTodo = {
			title: this.newTodo.trim(),
			completed: false
		};

		if (!newTodo.title) {
			return;
		}

		this.saving = true;
		this.store.insert(newTodo)
			.then(() => {
				this.newTodo = "";
			})
			.finally(() => {
				this.saving = false;
			});
	}

	public editTodo(todo) {
		this.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		this.originalTodo = angular.extend({}, todo);
	};

	public saveEdits(todo, event) {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === "blur" && this.saveEvent === "submit") {
			this.saveEvent = null;
			return;
		}

		this.saveEvent = event;

		if (this.reverted) {
			// Todo edits were reverted-- don't save.
			this.reverted = null;
			return;
		}

		todo.title = todo.title.trim();

		if (todo.title === this.originalTodo.title) {
			this.editedTodo = null;
			return;
		}

		this.store[todo.title ? "put" : "delete"](todo)
			.then(() => {
				// nothing to do on success
			}, () => {
				todo.title = this.originalTodo.title;
			})
			.finally(() => {
				this.editedTodo = null;
			});
	};

	public revertEdits(todo) {
		this.todos[this.todos.indexOf(todo)] = this.originalTodo;
		this.editedTodo = null;
		this.originalTodo = null;
		this.reverted = true;
	};

	public removeTodo(todo) {
		this.store.delete(todo);
	};

	public saveTodo(todo) {
		this.store.put(todo);
	};

	public toggleCompleted(todo, completed) {
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

	public clearCompletedTodos() {
		let todos = this.todos.slice(0);

		todos.forEach((todo) => {
			if (todo.completed) {
				this.store.delete(todo);
			}
		});
	};

	public markAll(completed) {
		this.todos.forEach((todo) => {
			if (todo.completed !== completed) {
				this.toggleCompleted(todo, completed);
			}
		});
	};
}
