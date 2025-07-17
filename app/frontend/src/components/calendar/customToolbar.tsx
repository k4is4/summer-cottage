import moment from "moment";
import "./customToolbar.css";
import type { ToolbarProps } from "react-big-calendar";
import type { CalendarEvent } from "../../types/calendarEvent";

const CustomToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = (props) => {
	const { date, onNavigate } = props;

	const month = moment(date).format("MMMM");
	const year = moment(date).format("YYYY");

	return (
		<div className="rbc-toolbar">
			<div className="toolbar-container">
				<button onClick={() => onNavigate("PREV")} aria-label="Previous Month">
					{"<<"}
				</button>
				<span className="toolbar-label">
					{month} {year}
				</span>
				<button onClick={() => onNavigate("NEXT")} aria-label="Next Month">
					{">>"}
				</button>
			</div>
		</div>
	);
};

export default CustomToolbar;
