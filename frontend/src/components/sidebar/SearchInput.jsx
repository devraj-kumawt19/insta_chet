import { useState } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import { apiGet } from "../../utils/api";
import toast from "react-hot-toast";
import { MdSearch, MdClose } from "react-icons/md";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSearch = async (e) => {
		const query = e.target.value;
		setSearch(query);

		if (query.length < 2) {
			setSearchResults([]);
			return;
		}

		try {
			setIsSearching(true);
			const results = await apiGet(`/api/users/search?q=${encodeURIComponent(query)}`);
			setSearchResults(results || []);
		} catch (error) {
			console.error(error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleSelectUser = (user) => {
		const conversation = conversations.find((c) => c._id === user._id);
		if (conversation) {
			setSelectedConversation(conversation);
		} else {
			setSelectedConversation(user);
		}
		setSearch("");
		setSearchResults([]);
	};

	const handleClear = () => {
		setSearch("");
		setSearchResults([]);
	};

	return (
		<div className="relative">
			<div className="relative">
				<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-lg" />
				<input
					type="text"
					placeholder="Search users..."
					className="input-modern pl-10 pr-10 w-full text-sm"
					value={search}
					onChange={handleSearch}
				/>
				{search && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
					>
						<MdClose className="text-lg" />
					</button>
				)}
			</div>

			{search && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
					{isSearching ? (
						<div className="p-3 text-center text-sm text-neutral-500">
							Searching...
						</div>
					) : searchResults.length === 0 ? (
						<div className="p-3 text-center text-sm text-neutral-500">
							No users found
						</div>
					) : (
						searchResults.map((user) => (
							<button
								key={user._id}
								onClick={() => handleSelectUser(user)}
								className="w-full px-3 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 flex items-center gap-3"
							>
								<img
									src={user.profilePic || "https://via.placeholder.com/40"}
									alt={user.fullName}
									className="w-10 h-10 rounded-full object-cover flex-shrink-0"
									onError={(e) => {
										e.target.src = "https://via.placeholder.com/40";
									}}
								/>
								<div className="flex-1 min-w-0">
									<div className="font-medium text-sm text-neutral-900 dark:text-white truncate">
										{user.fullName}
									</div>
									<div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
										@{user.username}
									</div>
								</div>
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default SearchInput;
