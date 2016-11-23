"use strict";

import {ILogService, IHttpService, IHttpPromiseCallbackArg} from "angular";
import {Todo} from "./todo.intf";
import {Observable} from "rxjs/Observable";
import {fromPromise} from "rxjs/observable/fromPromise";
import {empty} from "rxjs/observable/empty";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

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

	public clearCompleted(): Observable<IHttpPromiseCallbackArg<Todo[]>> {
		let incompleteTodos: Todo[] = this.todos.filter((todo: Todo) => {
			return !todo.completed;
		});

		return fromPromise(this.$http.delete("api/todos"))
			.map((resp: IHttpPromiseCallbackArg<Todo[]>) => {
				this.todos = [...incompleteTodos];
			})
			.catch((error: any) => {
				this.$log.error("store: delete failed", error);
				return empty(); // catch() should always return an observable
			});
	};

	public delete(todo: Todo): Observable<IHttpPromiseCallbackArg<any>> {
		return fromPromise(this.$http.delete("api/todos/" + todo.id))
			.map((resp: IHttpPromiseCallbackArg<any>) => {
				let newTodos: Todo[] = [...this.todos];
				newTodos.splice(newTodos.indexOf(todo), 1);
				this.todos = newTodos;
			})
			.catch((error: any) => {
				this.$log.error("store: delete failed", error);
				return empty(); // catch() should always return an observable
			});
	};

	public get(): Observable<IHttpPromiseCallbackArg<Todo[]>> {
		return fromPromise(this.$http.get("api/todos"))
			.map((resp: IHttpPromiseCallbackArg<Todo[]>) => {
				angular.copy(resp.data, this.todos);
			})
			.catch((error: any) => {
				this.$log.error("store: get failed", error);
				return empty(); // catch() should always return an observable
			});
	};

	public insert(todo: Todo): Observable<IHttpPromiseCallbackArg<Todo[]>> {
		let originalTodos: Todo[] = this.todos.slice(0);

		return fromPromise(this.$http.post("api/todos", todo))
			.map((resp: IHttpPromiseCallbackArg<Todo>) => {
				todo.id = resp.data["id"];
				this.todos = [...this.todos, todo];
			})
			.catch((error: any) => {
				this.$log.error("store: insert failed", error);
				angular.copy(originalTodos, this.todos);
				return empty(); // catch() should always return an observable
			});
	};

	public put(todo: Todo): Observable<any> {
		return fromPromise(this.$http.put("api/todos/" + todo.id, todo))
			.map((resp: IHttpPromiseCallbackArg<any>) => {
				this.todos = [...this.todos];
			});
	};
}
