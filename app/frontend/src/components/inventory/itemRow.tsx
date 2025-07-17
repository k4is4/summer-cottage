import React, { useEffect, useRef } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { Button } from "react-bootstrap";
import type { Item } from "../../types/item";
import { Category, Status } from "../../types/enums";

interface ItemRowProps {
	item: Item;
	handleStatusUpdate: (item: Item) => void;
	handleCommentChange: (item: Item, comment: string) => void;
	handleEdit: (item: Item) => void;
	handleDelete: (item: Item) => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
	item,
	handleStatusUpdate,
	handleCommentChange,
	handleEdit,
	handleDelete,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = item.comment || "";
		}
	}, [item.comment]);

	const saveComment = () => {
		if (inputRef.current) {
			handleCommentChange(item, inputRef.current.value);
		}
	};

	return (
		<tr tabIndex={0}>
			<td>{item.name}</td>
			<td>
				<Button
					onClick={() => handleStatusUpdate(item)}
					variant={
						item.status === 1
							? "primary"
							: item.status === 2
							? "warning"
							: item.status === 3
							? "danger"
							: ""
					}
					className="btn-sm"
				>
					{Status[item.status]}
				</Button>
			</td>
			<td>
				<input
					type="text"
					defaultValue={item.comment || ""}
					ref={inputRef}
					onBlur={saveComment}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.currentTarget.blur();
							saveComment();
						}
					}}
					className="comment-input"
				/>
			</td>
			<td>{new Date(item.updatedOn ?? "").toLocaleDateString("fi-FI")}</td>
			<td>{Category[item.category]}</td>
			<td>
				<AiOutlineEdit
					tabIndex={0}
					className="edit-icon"
					onClick={() => handleEdit(item)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleEdit(item);
						}
					}}
					aria-label={`Muokkaa ${item.name}`}
				/>
			</td>
			<td>
				<AiOutlineDelete
					tabIndex={0}
					className="delete-icon"
					onClick={() => handleDelete(item)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleDelete(item);
						}
					}}
					aria-label={`Poista ${item.name}`}
				/>
			</td>
		</tr>
	);
};

export default ItemRow;
