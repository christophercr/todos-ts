"use strict";

import {IComponentOptions} from "angular";
import {TodosPageController} from "./todosPageCtrl";

const templateContent: string = require("./todosPage.html");

export const todosPageComponent: IComponentOptions = {
	template: templateContent,
	controller: TodosPageController
};
