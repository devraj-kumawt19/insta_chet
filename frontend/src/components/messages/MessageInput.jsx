import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsSendFill } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import useSendMessage from "../../hooks/useSendMessage";
import { LoadingSpinner } from "../ui/UIComponents";

const EMOJIS = [
	"\u{1F600}",
	"\u{1F602}",
	"\u{1F60D}",
	"\u{1F914}",
	"\u{1F622}",
	"\u{1F44D}",
	"\u{2764}\u{FE0F}",
	"\u{1F525}",
	"\u{2728}",
	"\u{1F60E}",
];

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [showEmojis, setShowEmojis] = useState(false);
	const emojiRef = useRef(null);
	const inputRef = useRef(null);
	const { loading, sendMessage } = useSendMessage();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiRef.current && !emojiRef.current.contains(event.target)) {
				setShowEmojis(false);
			}
		};

		if (showEmojis) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}

		return undefined;
	}, [showEmojis]);

	const handleEmojiClick = (emoji) => {
		setMessage((current) => current + emoji);
		setShowEmojis(false);
		inputRef.current?.focus();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const trimmedMessage = message.trim();
		if (!trimmedMessage || loading) return;

		await sendMessage(trimmedMessage);
		setMessage("");
	};

	return (
		<form onSubmit={handleSubmit} className="w-full">
			<div className="flex items-center gap-2 px-3 py-3 sm:px-4">
				<div ref={emojiRef} className="relative flex-shrink-0">
					<button
						type="button"
						onClick={() => setShowEmojis((current) => !current)}
						className={`grid h-10 w-10 place-items-center rounded-full transition ${
							showEmojis
								? "bg-blue-600 text-white"
								: "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
						}`}
						title="Add emoji"
						aria-label="Add emoji"
					>
						<MdEmojiEmotions size={23} />
					</button>

					<AnimatePresence>
						{showEmojis && (
							<motion.div
								initial={{ opacity: 0, scale: 0.96, y: 8 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.96, y: 8 }}
								className="absolute bottom-full left-0 z-50 mb-3 grid w-60 grid-cols-5 gap-1 rounded-lg border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
							>
								{EMOJIS.map((emoji) => (
									<button
										key={emoji}
										type="button"
										onClick={() => handleEmojiClick(emoji)}
										className="grid h-10 w-10 place-items-center rounded-md text-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
									>
										{emoji}
									</button>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<input
					ref={inputRef}
					type="text"
					placeholder="Message..."
					className="h-11 min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none placeholder:text-neutral-500 focus:border-blue-500 focus:bg-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-blue-500 dark:focus:bg-neutral-900"
					value={message}
					onChange={(event) => setMessage(event.target.value)}
				/>

				<button
					type="submit"
					disabled={loading || !message.trim()}
					className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800"
					title="Send message"
					aria-label="Send message"
				>
					{loading ? <LoadingSpinner size="sm" /> : <BsSendFill size={17} />}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;
