"use strict";

import {IModule, ILogService, ITimeoutService} from "angular";

import {todosPageComponent} from "./pages/todosPage";
import {todoListComponent} from "./components/todoList";
import {TodoEscapeDirective} from "./directives/todoEscape";
import {TodoFocusDirective} from "./directives/todoFocus";
import {StoreService} from "./services/store";

export const todoModule: IModule = angular.module("todo", []);

todoModule
	.component("todosPage", todosPageComponent)
	.component("todoList", todoListComponent)

	.directive("todoEscape", ["$log", ($log: ILogService) => new TodoEscapeDirective($log)])
	.directive("todoFocus", ["$log", "$timeout", ($log: ILogService, $timeout: ITimeoutService) => new TodoFocusDirective($log, $timeout)])

	.service("store", StoreService);
