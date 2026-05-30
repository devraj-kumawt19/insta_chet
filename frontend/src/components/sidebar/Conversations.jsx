import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";
import { LoadingSpinner } from "../ui/UIComponents";

const Conversations = ({ onCloseSidebar }) => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="flex flex-col overflow-y-auto flex-1 px-2 sm:px-4 py-2 space-y-2">
			{conversations.length === 0 && !loading && (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="text-4xl mb-2">💬</div>
					<p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
						No conversations yet
					</p>
					<p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
						Start a new conversation
					</p>
				</div>
			)}

			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
					onCloseSidebar={onCloseSidebar}
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

// STARTER CODE SNIPPET
// import Conversation from "./Conversation";

// const Conversations = () => {
// 	return (
// 		<div className='py-2 flex flex-col overflow-auto'>
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 			<Conversation />
// 		</div>
// 	);
// };
// export default Conversations;
