import { Category } from "../../types/enums";

interface CategoryFilterProps {
	selectedCategory: number | null;
	setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
	selectedCategory,
	setSelectedCategory,
}) => {
	return (
		<div>
			<label htmlFor="categoryFilter" aria-label="Select category"></label>
			<select
				id="categoryFilter"
				value={selectedCategory || ""}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setSelectedCategory(
						e.target.value ? parseInt(e.target.value, 10) : null
					)
				}
			>
				<option value="">Kaikki</option>
				{Object.entries(Category)
					.filter(([key]) => isNaN(Number(key)))
					.map(([key, value]) => (
						<option key={key} value={value}>
							{key}
						</option>
					))}
			</select>
		</div>
	);
};

export default CategoryFilter;
