import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";
import { LoadingSpinner } from "../ui/UIComponents";
import { MdEmojiEmotions, MdAttachFile } from "react-icons/md";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojis, setShowEmojis] = useState(false);
	const emojiRef = useRef(null);
	const { loading, sendMessage } = useSendMessage();
	const { selectedConversation } = useConversation();

	const emojis = ["😀", "😂", "😍", "🤔", "😢", "😡", "👍", "❤️", "🔥", "✨", "👌", "😎"];

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (emojiRef.current && !emojiRef.current.contains(e.target)) {
				setShowEmojis(false);
			}
		};

		if (showEmojis) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [showEmojis]);

	const handleEmojiClick = (emoji) => {
		setMessage(message + emoji);
		setShowEmojis(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex items-end gap-3">
				{/* Emoji & Attach Buttons */}
<div className="flex gap-2 relative">
				<div ref={emojiRef} className="relative">
					<button
						type="button"
						onClick={() => setShowEmojis(!showEmojis)}
						className={`p-2.5 rounded-lg transition-all duration-200 ${showEmojis ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50'}`}
						title="Add emoji"
					>
						<MdEmojiEmotions className="text-xl" />
					</button>
					
					{/* Emoji Picker */}
					{showEmojis && (
						<div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 w-max">
						{emojis.map((emoji) => (
							<button
								key={emoji}
								type="button"
								onClick={() => handleEmojiClick(emoji)}
								className="text-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors cursor-pointer"
							>
								{emoji}
							</button>
						))}
						</div>
					)}
				</div>
					<button
						type="button"
						className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
						title="Attach file"
					>
						<MdAttachFile className="text-xl" />
					</button>
				</div>

				{/* Input Field */}
				<div className="flex-1 relative">
					<input
						type="text"
						placeholder="Type a message..."
						className="input-modern w-full"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
					/>
				</div>

				{/* Send Button */}
				<button
					type="submit"
					disabled={loading || !message.trim()}
					className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
						loading || !message.trim()
							? "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-600 cursor-not-allowed"
							: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-lg"
					}`}
					title="Send message"
				>
					{loading ? (
						<LoadingSpinner size="sm" />
					) : (
						<BsSend className="text-lg" />
					)}
				</button>
			</div>

			{/* Character Hint */}
			<div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
				Press Enter to send, Shift+Enter for new line
			</div>
		</form>
	);
};

export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
