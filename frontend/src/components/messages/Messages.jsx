import { useEffect, useRef } from "react";
import { MdWavingHand } from "react-icons/md";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	const containerRef = useRef();

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto bg-white px-2 py-4 dark:bg-neutral-950 sm:px-4 sm:py-5"
		>
			{!loading &&
				messages.map((message) => <Message key={message._id} message={message} />)}

			{loading && (
				<>
					<MessageSkeleton />
					<MessageSkeleton />
					<MessageSkeleton />
				</>
			)}

			{!loading && messages.length === 0 && (
				<div className="flex h-full items-center justify-center">
					<div className="max-w-xs text-center">
						<MdWavingHand className="mx-auto text-4xl text-amber-500" />
						<p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
							Start the conversation
						</p>
						<p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
							Send a message to say hello.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Messages;
