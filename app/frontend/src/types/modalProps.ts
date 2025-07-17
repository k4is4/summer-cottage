import type { Item } from "./item";

export interface ModalProps {
	selectedItem: Item | null;
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
}
