import { Spinner } from "react-bootstrap";

const LoadingIndicator: React.FC = () => (
	<div className="container d-flex justify-content-center align-items-center">
		<Spinner
			animation="border"
			variant="primary"
			role="status"
			aria-label="Loading..."
		/>
	</div>
);

export default LoadingIndicator;
