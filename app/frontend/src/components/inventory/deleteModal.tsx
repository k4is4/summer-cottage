import { Modal, Button } from "react-bootstrap";
import type { ModalProps } from "../../types/modalProps";
import itemService from "../../services/ItemService";

const DeleteModal: React.FC<ModalProps> = (props) => {
	const handleConfirmDelete = async (): Promise<void> => {
		if (props.selectedItem) {
			try {
				await deleteItem(props.selectedItem.id);
				props.setShowModal(false);
			} catch (e) {
				console.error("Error deleting item:", e);
				props.setError("Poistaminen ei onnistunut");
			}
		}
	};

	const deleteItem = async (itemId: number): Promise<void> => {
		await itemService.deleteItem(itemId);
		const updatedItems = props.items.filter((item) => item.id !== itemId);
		props.setItems(updatedItems);
	};

	return (
		<div>
			<Modal
				show={true}
				onHide={() => props.setShowModal(false)}
				aria-labelledby="delete-item-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title id="delete-item-modal">Poista</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Haluatko varmasti poistaa {props.selectedItem?.name}?</p>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => props.setShowModal(false)}
						aria-label="Cancel"
					>
						Peruuta
					</Button>
					<Button
						variant="danger"
						onClick={handleConfirmDelete}
						aria-label={`Delete ${props.selectedItem?.name}`}
					>
						Poista
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default DeleteModal;
