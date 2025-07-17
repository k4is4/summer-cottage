import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import type { Item } from "../../types/item";
import type { ModalProps }from "../../types/modalProps";
import itemService from "../../services/ItemService";
import useValidation from "../../hooks/useItemValidation";
import { Category, Status } from "../../types/enums";
import type { ItemFormData } from "../../types/itemFormData";
import "../modal.css";

const AddModal: React.FC<ModalProps> = (props) => {
	const [formData, setFormData] = useState<ItemFormData>({
		name: "",
		status: Status["?"],
		comment: "",
		category: Category.Muut,
	});

	const { nameError, commentError, formSubmitted, setFormSubmitted } =
		useValidation(
			formData.name,
			formData.comment,
			props.items.map((item) => item.name)
		);

	const handleSave = async () => {
		setFormSubmitted(true);
		if (nameError.length < 1 && commentError.length < 1) {
			try {
				const addedItem: Item = await itemService.addItem(formData);
				props.setItems([...props.items, addedItem]);
				props.setShowModal(false);
			} catch (e) {
				console.error("Error adding item:", e);
				props.setError("Lisäys ei onnistunut");
			}
		}
	};

	return (
		<Modal
			show={true}
			onHide={() => props.setShowModal(false)}
			aria-labelledby="add-item-modal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="add-item-modal">Lisää</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="form-group">
					<label htmlFor="name-input">Nimi</label>
					<input
						type="text"
						id="name-input"
						className="form-control"
						value={formData.name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
					{nameError && formSubmitted && (
						<span className="text-danger">{nameError}</span>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="status">Jäljellä</label>
					<select
						id="status"
						className="form-control"
						value={formData.status}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setFormData({
								...formData,
								status: Number(e.target.value) as Status,
							})
						}
					>
						{Object.entries(Status)
							.filter(([key]) => isNaN(Number(key)))
							.map(([key, value]) => (
								<option key={key} value={value}>
									{key}
								</option>
							))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="comment-input">Kommentti</label>
					<input
						type="text"
						id="comment-input"
						className="form-control"
						value={formData.comment}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setFormData({ ...formData, comment: e.target.value })
						}
					/>
					{commentError && formSubmitted && (
						<span className="text-danger">{commentError}</span>
					)}
				</div>
				<div className="form-group">
					<label htmlFor="category">Kategoria</label>
					<select
						id="category"
						className="form-control"
						value={formData.category}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setFormData({
								...formData,
								category: Number(e.target.value) as Category,
							})
						}
					>
						{Object.entries(Category)
							.filter(([key]) => isNaN(Number(key)))
							.map(([key, value]) => (
								<option key={key} value={value}>
									{key}
								</option>
							))}
					</select>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={() => props.setShowModal(false)}
					aria-label="Cancel"
				>
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
