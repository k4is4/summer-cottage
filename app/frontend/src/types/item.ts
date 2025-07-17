import { Category, Status } from "./enums";

export interface Item {
	id: number;
	name: string;
	status: Status;
	comment: string;
	category: Category;
	updatedOn: Date | undefined;
}
