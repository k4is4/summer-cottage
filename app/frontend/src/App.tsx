import { Route, Routes } from "react-router-dom";

import Banner from "./components/banner";
import ItemList from "./components/inventory/itemList";
import Navigation from "./components/navigation";
import CalendarComponent from "./components/calendar/calendarComponent";

const App: React.FC = () => {
	return (
		<>
			<Banner />
			<div>
				<Navigation />
				<Routes>
					<Route path="/" element={<ItemList />} />
					<Route path="/calendar" element={<CalendarComponent />} />
				</Routes>
			</div>
		</>
	);
};

export default App;
