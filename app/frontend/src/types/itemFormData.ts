import { Category, Status } from "./enums";

export interface ItemFormData {
	name: string;
	status: Status;
	comment: string;
	category: Category;
}
