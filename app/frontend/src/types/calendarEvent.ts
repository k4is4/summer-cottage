import { CalendarEventColor } from "./enums";

export interface CalendarEvent {
	id: number;
	note: string;
	startDate: Date;
	endDate: Date;
	color: CalendarEventColor;
	updatedOn: Date;
}
