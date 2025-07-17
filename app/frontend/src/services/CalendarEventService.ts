import type { AxiosError, AxiosResponse } from "axios";
import type { CalendarEvent } from "../types/calendarEvent";
import apiClient from "./apiClient";
import type { EventFormData } from "../types/eventFormData";
import type { ProblemDetails } from "../types/problemDetails";

class CalendarEventService {
	async getCalendarEvents(): Promise<CalendarEvent[]> {
		return apiClient
			.get<CalendarEvent[]>("/calendar-events")
			.then((response: AxiosResponse<CalendarEvent[]>) => response.data);
	}

	async addCalendarEvent(event: EventFormData): Promise<CalendarEvent> {
		return apiClient
			.post<CalendarEvent>("/calendar-events", event)
			.then((response: AxiosResponse<CalendarEvent>) => response.data)
			.catch(this.parseError<CalendarEvent>);
	}

	async updateCalendarEvent(event: CalendarEvent): Promise<CalendarEvent> {
		return apiClient
			.put<CalendarEvent>(`/calendar-events/${event.id}`, event)
			.then((response: AxiosResponse<CalendarEvent>) => response.data)
			.catch(this.parseError<CalendarEvent>);
	}

	async deleteCalendarEvent(id: number): Promise<void> {
		return apiClient.delete(`/calendar-events/${id}`);
	}

	parseError<T>(errorResponse: AxiosError<ProblemDetails>): Promise<T> {
		const errors = errorResponse.response?.data.errors;
		if (errors) {
			let errorsToDisplay: string = "";
			Object.keys(errors).forEach((key: string) => {
				errorsToDisplay += errors[key] + "\n";
			});
			throw Error(errorsToDisplay);
		} else {
			throw Error(errorResponse.response?.data);
		}
	}
}

const calendarEventService = new CalendarEventService();
export default calendarEventService;
