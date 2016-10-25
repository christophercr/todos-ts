"use strict";

export class StoreService {
	public $http;
	public $log;

	public todos;

	public static $inject = ["$http", "$log"];

	public constructor($http, $log) {
		this.$http = $http;
		this.$log = $log;

		this.todos = [];
	}

	public clearCompleted() {
		let originalTodos = this.todos.slice(0);

		let incompleteTodos = this.todos.filter((todo) => {
			return !todo.completed;
		});

		angular.copy(incompleteTodos, this.todos);

		return this.$http.delete("api/todos").then(
			() => {
				// nothing to do on success
			}, (resp) => {
				this.$log.error("store: delete failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);
	};

	public delete(todo) {
		let originalTodos = this.todos.slice(0);

		this.todos.splice(this.todos.indexOf(todo), 1);

		return this.$http.delete("api/todos/" + todo.id).then(
			() => {
				// nothing to do on success
			}, (resp) => {
				this.$log.error("store: delete failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);
	};

	public get() {
		return this.$http.get("api/todos").then(
			(resp) => {
				angular.copy(resp.data, this.todos);
			}, (resp) => {
				this.$log.error("store: get failed", resp);
			}
		);
	};

	public insert(todo) {
		let originalTodos = this.todos.slice(0);

		let httpPromise = this.$http.post("api/todos", todo);

		httpPromise.then(
			(resp) => {
				todo.id = resp.data["id"];
				this.todos.push(todo);
			}, (resp) => {
				this.$log.error("store: insert failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);

		return httpPromise;
	};

	public put(todo) {
		return this.$http.put("api/todos/" + todo.id, todo);
	};
}
