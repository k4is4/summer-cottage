import { Modal, Button } from "react-bootstrap";

interface ErrorModalProps {
	errorMessage?: string | null;
	onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorMessage, onClose }) => {
	const closeHandler: () => void = () => {
		onClose();
	};

	return (
		<Modal show={true} onHide={closeHandler}>
			<Modal.Header closeButton>
				<Modal.Title>Oho! Jotain meni vikaan</Modal.Title>
			</Modal.Header>
			<Modal.Body>{errorMessage}</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={closeHandler}
					aria-label="Close error modal"
				>
					Sulje
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ErrorModal;
