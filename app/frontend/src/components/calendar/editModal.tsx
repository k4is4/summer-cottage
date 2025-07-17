import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { CalendarEventColor } from "../../types/enums";
import type { CalendarEvent } from "../../types/calendarEvent";
import calendarEventService from "../../services/CalendarEventService";
import type { EventFormData } from "../../types/eventFormData";
import "../modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import { fi } from "date-fns/locale";
import useCalendarValidation from "../../hooks/useCalendarValidation";

interface EditModalProps {
	event: CalendarEvent;
	onClose: () => void;
	onSave: (oldEvent: CalendarEvent, newEvent: CalendarEvent) => void;
	onDelete: (event: CalendarEvent) => void;
	setError: (error: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({
	event,
	onClose,
	onSave,
	onDelete,
	setError,
}) => {
	const [formData, setFormData] = useState<EventFormData>({
		startDate: moment(event.startDate).startOf("day").add(12, "hours").toDate(),
		endDate: moment(event.endDate).startOf("day").add(12, "hours").toDate(),
		note: event.note,
		color: event.color,
	});
	const { dateError, commentError, formSubmitted, setFormSubmitted } =
		useCalendarValidation(formData.startDate, formData.endDate, formData.note);

	useEffect(() => {
		setFormData({
			startDate: moment(event.startDate)
				.startOf("day")
				.add(12, "hours")
				.toDate(),
			endDate: moment(event.endDate).startOf("day").add(12, "hours").toDate(),
			note: event.note,
			color: event.color,
		});
	}, [event]);

	const handleSave = async (): Promise<void> => {
		setFormSubmitted(true);
		if (dateError.length < 1 && commentError.length < 1) {
			try {
				const updateData: CalendarEvent = { ...event, ...formData };
				const updatedEvent: CalendarEvent =
					await calendarEventService.updateCalendarEvent(updateData);
				onSave(event, updatedEvent);
			} catch (e) {
				console.error("Error updating event:", e);
				setError("Muokkaus ei onnistunut");
			}
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			await calendarEventService.deleteCalendarEvent(event.id);
			onDelete(event);
		} catch (e) {
			console.error("Error deleting event:", e);
			setError("Poisto ei onnistunut");
		}
	};

	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Muokkaa</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="form-group">
					<label htmlFor="startDate">Saapumispäivä</label>
					<div>
						<DatePicker
							selected={formData.startDate}
							dateFormat="dd.MM.yyyy"
							locale={fi}
							onChange={(date: Date | null) =>
								setFormData({
									...formData,
									startDate: moment(date)
										.tz("Europe/Helsinki")
										.startOf("day")
										.add(12, "hours")
										.toDate(),
								})
							}
							calendarStartDay={1}
						/>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="endDate">Lähtöpäivä</label>
					<div>
						<DatePicker
							selected={formData.endDate}
							dateFormat="dd.MM.yyyy"
							locale={fi}
							onChange={(date: Date | null) =>
								setFormData({
									...formData,
									endDate: moment(date)
										.tz("Europe/Helsinki")
										.startOf("day")
										.add(12, "hours")
										.toDate(),
								})
							}
						/>
					</div>
					{dateError && formSubmitted && (
						<span className="text-danger">{dateError}</span>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="note">Nimi</label>
					<input
						id="note"
						type="text"
						className="form-control"
						value={formData.note}
						onChange={(e) => setFormData({ ...formData, note: e.target.value })}
					/>
					{commentError && formSubmitted && (
						<span className="text-danger">{commentError}</span>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="color">Väri</label>
					<select
						id="color"
						className="form-control"
						value={formData.color}
						onChange={(e) =>
							setFormData({
								...formData,
								color: Number(e.target.value) as CalendarEventColor,
							})
						}
					>
						<option value={CalendarEventColor["#BB0C0C"]}>
							Punainen - Varattu
						</option>
						<option value={CalendarEventColor.green}>
							Vihreä - Saa tulla mukaan
						</option>
					</select>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose} aria-label="Cancel">
					Peruuta
				</Button>
				<Button variant="danger" onClick={handleDelete} aria-label="Delete">
					Poista
				</Button>
				<Button variant="primary" onClick={handleSave} aria-label="Save">
					Tallenna
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditModal;
