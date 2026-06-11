import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { LoadingSpinner } from "../ui/UIComponents";

const Conversations = ({ onCloseSidebar, onConversationSelect, filter = "all" }) => {
	const { loading, conversations } = useGetConversations();
	const visibleConversations =
		filter === "unread"
			? conversations.filter((conversation) => conversation.hasUnread)
			: conversations;

	return (
		<div className="flex flex-1 flex-col overflow-y-auto px-2 pb-4 sm:px-3">
			{visibleConversations.length === 0 && !loading && (
				<div className="flex flex-col items-center justify-center px-4 py-12 text-center">
					<p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
						{filter === "unread" ? "No unread messages" : "No conversations yet"}
					</p>
					<p className="mt-1 text-xs text-neutral-500">
						{filter === "unread"
							? "You are all caught up"
							: "Search for someone to start chatting"}
					</p>
				</div>
			)}

			{visibleConversations.map((conversation) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					onCloseSidebar={onCloseSidebar}
					onConversationSelect={onConversationSelect}
				/>
			))}

			{loading && (
				<div className="flex justify-center py-8">
					<LoadingSpinner size="md" />
				</div>
			)}
		</div>
	);
};

export default Conversations;
