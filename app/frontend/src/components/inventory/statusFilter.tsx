import { Status } from "../../types/enums";

interface StatusFilterProps {
	selectedStatus: number | null;
	setSelectedStatus: React.Dispatch<React.SetStateAction<number | null>>;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
	selectedStatus,
	setSelectedStatus,
}) => {
	return (
		<div>
			<label htmlFor="statusFilter"></label>
			<select
				id="statusFilter"
				value={selectedStatus || ""}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
					setSelectedStatus(
						e.target.value ? parseInt(e.target.value, 10) : null
					)
				}
			>
				<option value="">Kaikki</option>
				{Object.entries(Status)
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

export default StatusFilter;
