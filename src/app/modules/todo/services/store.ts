"use strict";

import {ILogService, IHttpService, IHttpPromiseCallbackArg} from "angular";
import {Todo} from "../components/todo.intf";

export class StoreService {
	public $http: IHttpService;
	public $log: ILogService;

	public todos: Todo[];

	public static $inject: string[] = ["$http", "$log"];

	public constructor($http: IHttpService, $log: ILogService) {
		this.$http = $http;
		this.$log = $log;

		this.todos = [];
	}

	public clearCompleted(): Promise<any> {
		let originalTodos: Todo[] = this.todos.slice(0);

		let incompleteTodos: Todo[] = this.todos.filter((todo: Todo) => {
			return !todo.completed;
		});

		angular.copy(incompleteTodos, this.todos);

		return this.$http.delete("api/todos").then(
			() => {
				// nothing to do on success
			}, (resp: any) => {
				this.$log.error("store: delete failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);
	};

	public delete(todo: Todo): Promise<any> {
		let originalTodos: Todo[] = this.todos.slice(0);

		this.todos.splice(this.todos.indexOf(todo), 1);

		return this.$http.delete("api/todos/" + todo.id).then(
			() => {
				// nothing to do on success
			}, (resp: any) => {
				this.$log.error("store: delete failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);
	};

	public get(): Promise<any> {
		return this.$http.get("api/todos").then(
			(resp: IHttpPromiseCallbackArg<Todo[]>) => {
				angular.copy(resp.data, this.todos);
			}, (resp: any) => {
				this.$log.error("store: get failed", resp);
			}
		);
	};

	public insert(todo: Todo): Promise<any> {
		let originalTodos: Todo[] = this.todos.slice(0);

		let httpPromise: Promise<any> = this.$http.post("api/todos", todo);

		httpPromise.then(
			(resp: IHttpPromiseCallbackArg<Todo>) => {
				todo.id = resp.data["id"];
				this.todos.push(todo);
			}, (resp: any) => {
				this.$log.error("store: insert failed", resp);
				angular.copy(originalTodos, this.todos);
			}
		);

		return httpPromise;
	};

	public put(todo: Todo): Promise<any> {
		return this.$http.put("api/todos/" + todo.id, todo);
	};
}
