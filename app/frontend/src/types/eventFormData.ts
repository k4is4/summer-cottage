import { CalendarEventColor } from "./enums";

export interface EventFormData {
	note: string;
	startDate: Date;
	endDate: Date;
	color: CalendarEventColor;
}
