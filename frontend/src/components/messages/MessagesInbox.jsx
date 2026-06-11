import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
	MdArrowBack,
	MdEditSquare,
	MdKeyboardArrowDown,
	MdMoreHoriz,
} from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import Conversations from "../sidebar/Conversations";
import SearchInput from "../sidebar/SearchInput";
import { ProfileImage } from "../ui/UIComponents";

const MessagesInbox = ({ onOpenConversation, onBack }) => {
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const { conversations, setSelectedConversation } = useConversation();
	const [filter, setFilter] = useState("all");

	const activePeople = useMemo(
		() =>
			conversations.filter((conversation) =>
				onlineUsers.some((userId) => String(userId) === String(conversation._id))
			),
		[conversations, onlineUsers]
	);

	const openConversation = (conversation) => {
		setSelectedConversation(conversation);
		onOpenConversation?.();
	};

	const focusSearch = () => {
		document.getElementById("message-user-search")?.focus();
	};

	return (
		<section className="flex h-full min-h-0 flex-col bg-white dark:bg-neutral-950">
			<header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-800 sm:px-5">
				<div className="flex min-w-0 items-center gap-2">
					<button
						type="button"
						onClick={onBack}
						className="grid h-10 w-10 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 md:hidden"
						aria-label="Back to home"
					>
						<MdArrowBack size={24} />
					</button>
					<div className="flex min-w-0 items-center gap-1 px-1 py-2">
						<span className="truncate text-base font-bold text-neutral-950 dark:text-white sm:text-lg">
							{authUser?.username || "Messages"}
						</span>
						<MdKeyboardArrowDown className="flex-shrink-0 text-neutral-600 dark:text-neutral-300" size={20} />
					</div>
				</div>

				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => setFilter((current) => (current === "all" ? "unread" : "all"))}
						className="grid h-10 w-10 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
						aria-label={filter === "unread" ? "Show all messages" : "Show unread messages"}
						title={filter === "unread" ? "Show all messages" : "Show unread messages"}
					>
						<MdMoreHoriz size={25} />
					</button>
					<button
						type="button"
						onClick={focusSearch}
						className="grid h-10 w-10 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
						aria-label="Start a new message"
					>
						<MdEditSquare size={23} />
					</button>
				</div>
			</header>

			<div className="flex-shrink-0 px-4 pb-2 pt-3 sm:px-5">
				<div className="flex items-center gap-3">
					<SearchInput onUserSelect={openConversation} inputId="message-user-search" />
					<button
						type="button"
						onClick={() => setFilter((current) => (current === "all" ? "unread" : "all"))}
						className={`flex-shrink-0 text-sm font-semibold transition ${
							filter === "unread"
								? "text-blue-600 dark:text-blue-400"
								: "text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
						}`}
					>
						{filter === "unread" ? "All" : "Unread"}
					</button>
				</div>
			</div>

			{activePeople.length > 0 && (
				<div className="flex-shrink-0 border-b border-neutral-100 pb-3 pt-1 dark:border-neutral-800">
					<div className="no-scrollbar flex gap-4 overflow-x-auto px-4 sm:px-5">
						{activePeople.map((person) => (
							<motion.button
								key={person._id}
								type="button"
								whileTap={{ scale: 0.96 }}
								onClick={() => openConversation(person)}
								className="w-[68px] flex-shrink-0 text-center"
							>
								<div className="relative mx-auto w-fit">
									<div className="rounded-full border-2 border-emerald-500 p-0.5">
										<ProfileImage
											src={person.profilePic}
											alt={person.fullName}
											size="h-14 w-14"
											initials={person.fullName?.charAt(0).toUpperCase() || "?"}
										/>
									</div>
									<span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-neutral-950" />
								</div>
								<p className="mt-1.5 truncate text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
									{person.username}
								</p>
							</motion.button>
						))}
					</div>
				</div>
			)}

			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex items-center justify-between px-4 pb-1 pt-3 sm:px-5">
					<h2 className="text-sm font-bold text-neutral-950 dark:text-white">Messages</h2>
					<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
						{conversations.length} people
					</span>
				</div>
				<Conversations filter={filter} onConversationSelect={onOpenConversation} />
			</div>
		</section>
	);
};

export default MessagesInbox;
