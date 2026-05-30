import { MdFavoriteBorder, MdFavorite } from "react-icons/md";

const GenderCheckbox = ({ onCheckboxChange, selectedGender }) => {
	return (
		<div className="flex gap-4 sm:gap-6 mt-4">
			{/* Male Option */}
			<button
				type="button"
				onClick={() => onCheckboxChange("male")}
				className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
					selectedGender === "male"
						? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
						: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
				}`}
			>
				<span className="text-xl">👨</span>
				<span>Male</span>
			</button>

			{/* Female Option */}
			<button
				type="button"
				onClick={() => onCheckboxChange("female")}
				className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
					selectedGender === "female"
						? "bg-gradient-to-r from-accent-600 to-accent-700 text-white shadow-lg"
						: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-accent-300 dark:hover:border-accent-700"
				}`}
			>
				<span className="text-xl">👩</span>
				<span>Female</span>
			</button>
		</div>
	);
};

export default GenderCheckbox;
