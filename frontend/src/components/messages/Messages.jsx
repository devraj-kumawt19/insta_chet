import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();
	const containerRef = useRef();

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div ref={containerRef} className="px-3 sm:px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-4 bg-gradient-to-br from-white to-neutral-50 dark:from-dark-surface dark:to-dark-bg">
			{!loading && messages.length > 0 ? (
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))
			) : null}

			{loading && (
				<>
					<MessageSkeleton />
					<MessageSkeleton />
					<MessageSkeleton />
				</>
			)}

			{!loading && messages.length === 0 && (
				<div className="flex items-center justify-center h-full">
					<div className="text-center space-y-2">
						<div className="text-4xl">👋</div>
						<p className="text-sm text-neutral-600 dark:text-neutral-400">
							No messages yet
						</p>
						<p className="text-xs text-neutral-500 dark:text-neutral-500">
							Start a conversation by sending a message
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Messages;

// STARTER CODE SNIPPET
// import Message from "./Message";

// const Messages = () => {
// 	return (
// 		<div className='px-4 flex-1 overflow-auto'>
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 			<Message />
// 		</div>
// 	);
// };
// export default Messages;
