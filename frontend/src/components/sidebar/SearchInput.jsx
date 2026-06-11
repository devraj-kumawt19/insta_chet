import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import { apiGet } from "../../utils/api";
import { ProfileImage } from "../ui/UIComponents";

const SearchInput = ({ onUserSelect, inputId }) => {
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const { setSelectedConversation, conversations } = useConversation();

	useEffect(() => {
		const query = search.trim();
		if (query.length < 2) {
			setSearchResults([]);
			setIsSearching(false);
			return undefined;
		}

		const timeout = setTimeout(async () => {
			setIsSearching(true);
			try {
				const results = await apiGet(`/api/users/search?q=${encodeURIComponent(query)}`);
				setSearchResults(results || []);
			} catch {
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [search]);

	const handleSelectUser = (user) => {
		const conversation = conversations.find((item) => item._id === user._id) || user;
		setSelectedConversation(conversation);
		setSearch("");
		setSearchResults([]);
		onUserSelect?.(conversation);
	};

	const handleClear = () => {
		setSearch("");
		setSearchResults([]);
	};

	return (
		<div className="relative min-w-0 flex-1">
			<div className="relative">
				<MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-neutral-500" />
				<input
					type="text"
					id={inputId}
					placeholder="Search"
					className="h-10 w-full rounded-xl border-0 bg-neutral-100 pl-10 pr-10 text-sm text-neutral-950 outline-none ring-0 placeholder:text-neutral-500 focus:bg-neutral-100 focus:ring-1 focus:ring-neutral-300 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-400 dark:focus:bg-neutral-900 dark:focus:ring-neutral-700"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
				/>
				{search && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-white"
						aria-label="Clear search"
					>
						<MdClose className="text-lg" />
					</button>
				)}
			</div>

			{search && (
				<div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
					{isSearching ? (
						<div className="p-4 text-center text-sm text-neutral-500">Searching...</div>
					) : searchResults.length === 0 ? (
						<div className="p-4 text-center text-sm text-neutral-500">No users found</div>
					) : (
						searchResults.map((user) => (
							<button
								key={user._id}
								type="button"
								onClick={() => handleSelectUser(user)}
								className="flex w-full items-center gap-3 border-b border-neutral-100 px-3 py-3 text-left transition last:border-b-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
							>
								<ProfileImage
									src={user.profilePic}
									alt={user.fullName}
									size="h-10 w-10"
									initials={user.fullName?.charAt(0).toUpperCase() || "?"}
								/>
								<div className="min-w-0 flex-1">
									<div className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
										{user.fullName}
									</div>
									<div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
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
