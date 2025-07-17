import React, { useEffect, useState } from "react";
import type { Item } from "../../types/item";
import EditModal from "./editModal";
import DeleteModal from "./deleteModal";
import { Button } from "react-bootstrap";
import AddModal from "./addModal";
import "./itemList.css";
import itemService from "../../services/ItemService";
import StatusFilter from "./statusFilter";
import CategoryFilter from "./categoryFilter";
import ItemRow from "./itemRow";
import ErrorModal from "../errorModal";
import LoadingIndicator from "../loadingIndicator";

const ItemList: React.FC = () => {
	const [items, setItems] = useState<Item[]>([]);
	const [selectedItem, setSelectedItem] = useState<Item | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async (): Promise<void> => {
		setIsLoading(true);
		try {
			const fetchedItems: Item[] = await itemService.getItems();
			setItems(fetchedItems);
		} catch (e) {
			console.error("Error fetching items:", e);
			setError("Inventaarion haku ei onnistunut");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (item: Item): void => {
		setSelectedItem(item);
		setShowEditModal(true);
	};

	const handleDelete = (item: Item): void => {
		setSelectedItem(item);
		setShowDeleteModal(true);
	};

	const handleStatusUpdate = async (item: Item): Promise<void> => {
		try {
			const numberOfStatuses: number = 4;
			const nextStatus: number = (item.status % numberOfStatuses) + 1;
			const updatedItem: Item = { ...item, status: nextStatus };
			await itemService.updateItem(updatedItem);
			const updatedItems: Item[] = items.map((it) =>
				it.id === item.id ? updatedItem : it
			);
			setItems(updatedItems);
		} catch (e) {
			console.error("Error updating status:", e);
			setError("Statuksen päivitys ei onnistunut");
		}
	};

	const handleCommentChange = async (
		item: Item,
		comment: string
	): Promise<void> => {
		try {
			const updatedItem: Item = { ...item, comment: comment };
			await itemService.updateItem(updatedItem);
			const updatedItems: Item[] = items.map((i) =>
				i.id === item.id ? { ...i, comment } : i
			);
			setItems(updatedItems);
		} catch (error) {
			console.error("Error updating status:", error);
			setError("Kommentin päivitys ei onnistunut");
		}
	};

	if (isLoading) {
		return <LoadingIndicator />;
	}

	return (
		<div className="container">
			<table className="table">
				<thead>
					<tr>
						<th scope="col">Nimi</th>
						<th scope="col">
							<StatusFilter
								aria-label="Choose status filter"
								selectedStatus={selectedStatus}
								setSelectedStatus={setSelectedStatus}
							/>
							Jäljellä
						</th>
						<th scope="col">Kommentti</th>
						<th scope="col">Muokattu</th>
						<th scope="col">
							<CategoryFilter
								aria-label="Choose category filter"
								selectedCategory={selectedCategory}
								setSelectedCategory={setSelectedCategory}
							/>
							Kategoria
						</th>
						<th scope="col"></th>
						<th scope="col">
							<Button
								className="btn-sm"
								onClick={() => setShowAddModal(true)}
								aria-label="Add new"
							>
								Lisää
							</Button>
						</th>
					</tr>
				</thead>
				<tbody>
					{items
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((item) => {
							if (
								(selectedCategory === null ||
									item.category === selectedCategory) &&
								(selectedStatus === null || item.status === selectedStatus)
							) {
								return (
									<ItemRow
										key={item.id}
										item={item}
										handleStatusUpdate={handleStatusUpdate}
										handleCommentChange={handleCommentChange}
										handleEdit={handleEdit}
										handleDelete={handleDelete}
									/>
								);
							}
							return null;
						})}
				</tbody>
			</table>
			<div>
				{error && (
					<ErrorModal
						aria-label="Show error modal"
						errorMessage={error}
						onClose={() => setError(null)}
					/>
				)}
				{showAddModal && (
					<AddModal
						aria-label="Add new item modal"
						selectedItem={null}
						items={items}
						setItems={setItems}
						setShowModal={setShowAddModal}
						setError={setError}
					></AddModal>
				)}
				{showEditModal && (
					<EditModal
						aria-label="Edit item modal"
						selectedItem={selectedItem}
						items={items}
						setItems={setItems}
						setShowModal={setShowEditModal}
						setError={setError}
					></EditModal>
				)}
				{showDeleteModal && (
					<DeleteModal
						aria-label="Delete item modal"
						selectedItem={selectedItem}
						items={items}
						setItems={setItems}
						setShowModal={setShowDeleteModal}
						setError={setError}
					></DeleteModal>
				)}
			</div>
		</div>
	);
};

export default ItemList;
