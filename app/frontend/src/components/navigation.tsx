import { Link, useMatch } from "react-router-dom";

const Navigation: React.FC = () => {
	const isActive = useMatch("/");
	const isCalendarActive = useMatch("/calendar");

	return (
		<nav
			className="navbar navbar-expand-lg navbar-dark"
			aria-label="Main navigation"
		>
			<div className="container">
				<ul className="nav nav-tabs justify-content-center">
					<li className="nav-item">
						<Link
							className={`nav-link ${isActive ? "active" : ""}`}
							to="/"
							aria-current={isActive ? "page" : undefined}
						>
							Inventaario
						</Link>
					</li>
					<li className="nav-item">
						<Link
							className={`nav-link ${isCalendarActive ? "active" : ""}`}
							to="/calendar"
							aria-current={isCalendarActive ? "page" : undefined}
						>
							Kalenteri
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navigation;