import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
		<form onSubmit={handleSubmit} className="w-full bg-gradient-to-t from-white/80 to-transparent dark:from-neutral-900/80 dark:to-transparent backdrop-blur-sm">
			<div className="px-3 sm:px-4 py-3 sm:py-4 flex items-end gap-2 sm:gap-3">
				{/* Emoji & Attach Buttons */}
				<div className="flex gap-1 sm:gap-2 relative">
					<div ref={emojiRef} className="relative">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => setShowEmojis(!showEmojis)}
							className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
								showEmojis
									? "bg-pink-500 dark:bg-pink-600 text-white shadow-lg"
									: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700"
							}`}
							title="Add emoji"
						>
							<MdEmojiEmotions className="text-lg sm:text-xl" />
						</motion.button>
						
						{/* Emoji Picker */}
						<AnimatePresence>
							{showEmojis && (
								<motion.div 
									initial={{ opacity: 0, scale: 0.95, y: 10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: 10 }}
									transition={{ duration: 0.15 }}
									className="absolute bottom-full left-0 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl p-3 grid grid-cols-6 gap-2 w-max z-50 backdrop-blur-sm"
								>
									{emojis.map((emoji) => (
										<motion.button
											key={emoji}
											whileHover={{ scale: 1.3, rotate: 10 }}
											whileTap={{ scale: 0.9 }}
											type="button"
											onClick={() => handleEmojiClick(emoji)}
											className="text-xl sm:text-2xl p-1 sm:p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
										>
											{emoji}
										</motion.button>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						type="button"
						className="p-2 sm:p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
						title="Attach file"
					>
						<MdAttachFile className="text-lg sm:text-xl" />
					</motion.button>
				</div>

				{/* Input Field */}
				<motion.div 
					initial={{ width: "100%" }}
					className="flex-1 relative"
				>
					<motion.input
						whileFocus={{ scale: 1.01 }}
						type="text"
						placeholder="Message..."
						className="w-full bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-400 dark:focus:ring-pink-500 focus:border-transparent dark:text-neutral-50 transition-all shadow-sm focus:shadow-lg"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
					/>
				</motion.div>

				{/* Send Button */}
				<motion.button
					whileHover={{ scale: 1.08 }}
					whileTap={{ scale: 0.92 }}
					type="submit"
					disabled={loading || !message.trim()}
					className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl ${
						loading || !message.trim()
							? "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-600 cursor-not-allowed"
							: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/50 hover:shadow-pink-500/70"
					}`}
					title="Send message (Enter)"
				>
					{loading ? (
						<LoadingSpinner size="sm" />
					) : (
						<BsSend className="text-lg sm:text-xl" />
					)}
				</motion.button>
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
