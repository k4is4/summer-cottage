import React, { useEffect, useState } from "react";
import type { SlotInfo } from "react-big-calendar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEventColor } from "../../types/enums";
import AddModal from "./addModal";
import EditModal from "./editModal";
import type { CalendarEvent } from "../../types/calendarEvent";
import calendarEventService from "../../services/CalendarEventService";
import "moment/locale/fi";
import customToolbar from "./customToolbar";
import ErrorModal from "../errorModal";
import LoadingIndicator from "../loadingIndicator";

moment.tz.setDefault("Europe/Helsinki");
const localizer = momentLocalizer(moment);
localizer.segmentOffset = 0;

const CalendarComponent: React.FC = () => {
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);
	const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const fetchedEvents: CalendarEvent[] =
				await calendarEventService.getCalendarEvents();
			setEvents(fetchedEvents);

			let latestDate: Date | null = null;
			fetchedEvents.forEach((p) => {
				const updatedOn: Date | null = p.updatedOn
					? new Date(p.updatedOn)
					: null;
				if (updatedOn && (!latestDate || updatedOn > latestDate)) {
					latestDate = updatedOn;
				}
			});
			setLastUpdated(latestDate);
		} catch (error) {
			console.error(error);
			setError("Kalenterin haku ei onnistunut");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSlotSelection = (slotInfo: SlotInfo): void => {
		setSelectedSlot(slotInfo);
	};

	const handleEventSelection = (
		event: CalendarEvent
	): void => {
		setSelectedEvent(event);
	};

	const handleEventUpdate = (
		oldEvent: CalendarEvent,
		updatedEvent: CalendarEvent
	): void => {
		const updatedEventWithJsDates = {
			...updatedEvent,
			startDate: new Date(updatedEvent.startDate),
			endDate: new Date(updatedEvent.endDate),
			updatedOn: new Date(),
		};
		setEvents(
			events.map((event) =>
				event.id === oldEvent.id ? updatedEventWithJsDates : event
			)
		);
		setLastUpdated(new Date());
		setSelectedEvent(null);
	};

	const handleEventDelete = (eventToDelete: CalendarEvent): void => {
		setEvents(events.filter((event) => event.id !== eventToDelete.id));
		setLastUpdated(new Date());
		setSelectedEvent(null);
	};

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<div className="container">
			<Calendar
				views={["month"]}
				messages={{
					next: "Seuraava kuukausi >>",
					previous: "<< Edellinen kuukausi",
					today: "Tänään",
					month: "Kuukausi",
				}}
				localizer={localizer}
				events={events.map((event) => ({ ...event, title: event.note }))}
				startAccessor={(event) => event.startDate}
				endAccessor={(event) => event.endDate}
				style={{ height: 500, cursor: "pointer" }}
				eventPropGetter={(event: CalendarEvent) => ({
					style: {
						backgroundColor: CalendarEventColor[event.color],
						height: "30px",
					},
				})}
				selectable={true}
				onSelectSlot={handleSlotSelection}
				onSelectEvent={handleEventSelection}
				components={{ toolbar: customToolbar }}
			/>
			{error && (
				<ErrorModal errorMessage={error} onClose={() => setError(null)} />
			)}
			{selectedSlot && (
				<AddModal
					slotInfo={selectedSlot}
					onClose={() => setSelectedSlot(null)}
					onSave={(newEvent: CalendarEvent) => {
						setEvents((prevEvents) => [...prevEvents, newEvent]);
						setLastUpdated(new Date(newEvent.updatedOn));
						setSelectedSlot(null);
					}}
					setError={setError}
				/>
			)}
			{selectedEvent && (
				<EditModal
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
					onSave={handleEventUpdate}
					onDelete={handleEventDelete}
					setError={setError}
				/>
			)}
			<div className="container">
				<p>
					Muokattu:{" "}
					{lastUpdated ? moment(lastUpdated).format("DD/MM/YYYY HH:mm") : "?"}
				</p>
			</div>
		</div>
	);
};

export default CalendarComponent;
