import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { CalendarEventColor } from "../../types/enums";
import type { SlotInfo } from "react-big-calendar";
import type { CalendarEvent } from "../../types/calendarEvent";
import calendarEventService from "../../services/CalendarEventService";
import type { EventFormData } from "../../types/eventFormData";
import "../modal.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import { fi } from "date-fns/locale";
import useCalendarValidation from "../../hooks/useCalendarValidation";

interface AddModalProps {
	slotInfo: SlotInfo;
	onClose: () => void;
	onSave: (newEvent: CalendarEvent) => void;
	setError: (error: string) => void;
}

const AddModal: React.FC<AddModalProps> = ({
	slotInfo,
	onClose,
	onSave,
	setError,
}) => {
	const [formData, setFormData] = useState<EventFormData>({
		startDate: moment(slotInfo.start).startOf("day").add(12, "hours").toDate(),
		endDate: moment(slotInfo.end).startOf("day").add(12, "hours").toDate(),
		note: "",
		color: CalendarEventColor.green,
	});
	const { dateError, commentError, formSubmitted, setFormSubmitted } =
		useCalendarValidation(formData.startDate, formData.endDate, formData.note);

	const handleSave = async (): Promise<void> => {
		setFormSubmitted(true);
		if (dateError.length < 1 && commentError.length < 1) {
			try {
				const addedEvent: CalendarEvent =
					await calendarEventService.addCalendarEvent(formData);
				onSave(addedEvent);
			} catch (e) {
				console.error("Error adding event:", e);
				setError("Lisäys ei onnistunut");
			}
		}
	};

	return (
		<Modal show={true} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>Lisää uusi mökkireissu</Modal.Title>
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
				<Button variant="primary" onClick={handleSave} aria-label="Save">
					Tallenna
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AddModal;
