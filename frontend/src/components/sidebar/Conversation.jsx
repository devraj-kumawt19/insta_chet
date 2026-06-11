import { useState } from "react";
import { MdChevronRight } from "react-icons/md";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import UserProfile from "../profile/UserProfile";
import { StatusBadge, ProfileImage } from "../ui/UIComponents";
import { extractTime } from "../../utils/extractTime";

const Conversation = ({ conversation, onCloseSidebar, onConversationSelect }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const [showProfile, setShowProfile] = useState(false);

	const isSelected = selectedConversation?._id === conversation._id;
	const isOnline = onlineUsers.some((userId) => String(userId) === String(conversation._id));
	const lastMessage = conversation.lastMessage;
	const lastMessageFromMe =
		lastMessage?.senderId && authUser?._id && String(lastMessage.senderId) === String(authUser._id);
	const messagePreview = lastMessage?.message
		? `${lastMessageFromMe ? "You: " : ""}${lastMessage.message}`
		: `@${conversation.username}`;
	const lastMessageTime = conversation.lastMessageAt
		? extractTime(conversation.lastMessageAt)
		: lastMessage?.createdAt
		? extractTime(lastMessage.createdAt)
		: "";

	const handleConversationClick = () => {
		setSelectedConversation(conversation);
		onCloseSidebar?.();
		onConversationSelect?.(conversation);
	};

	return (
		<>
			<button
				type="button"
				className={`group relative flex w-full items-center gap-3 rounded-md px-2 py-3 text-left transition-colors sm:px-3 ${
					isSelected
						? "bg-neutral-100 dark:bg-neutral-800"
						: "hover:bg-neutral-50 dark:hover:bg-neutral-900"
				}`}
				onClick={handleConversationClick}
			>
				<div
					className="relative flex-shrink-0"
					onClick={(event) => {
						event.stopPropagation();
						setShowProfile(true);
					}}
				>
					<ProfileImage
						src={conversation.profilePic}
						alt={conversation.fullName}
						size="h-14 w-14"
						initials={
							conversation.fullName?.charAt(0).toUpperCase() ||
							conversation.username?.charAt(0).toUpperCase() ||
							"?"
						}
						className="ring-1 ring-neutral-200 dark:ring-neutral-700"
					/>
					<StatusBadge
						status={isOnline ? "online" : "offline"}
						className="absolute bottom-0 right-0 border-2 border-white dark:border-neutral-950"
					/>
				</div>

				<div className="min-w-0 flex-1">
					<p
						className={`truncate text-sm text-neutral-950 dark:text-white ${
							conversation.hasUnread ? "font-bold" : "font-semibold"
						}`}
					>
						{conversation.fullName}
					</p>
					<div className="mt-0.5 flex min-w-0 items-center gap-1 text-xs">
						<p
							className={`truncate ${
								conversation.hasUnread
									? "font-semibold text-neutral-900 dark:text-neutral-100"
									: "text-neutral-600 dark:text-neutral-400"
							}`}
						>
							{messagePreview}
						</p>
						{lastMessageTime && (
							<span className="flex-shrink-0 text-neutral-400 dark:text-neutral-500">
								· {lastMessageTime}
							</span>
						)}
					</div>
				</div>

				<div className="flex flex-shrink-0 items-center gap-3">
					{conversation.hasUnread && <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
					<MdChevronRight className="text-xl text-neutral-400 transition group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
				</div>
			</button>

			{showProfile && (
				<UserProfile userId={conversation._id} onClose={() => setShowProfile(false)} />
			)}
		</>
	);
};

export default Conversation;
