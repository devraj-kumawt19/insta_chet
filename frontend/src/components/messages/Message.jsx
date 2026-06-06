import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import { getAvatarUrl } from "../../utils/avatarUtils";
import useConversation from "../../zustand/useConversation";
import { MdCheckCircle, MdDone } from "react-icons/md";
import { ProfileImage } from "../ui/UIComponents";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const profilePicUrl = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const profilePic = fromMe 
		? getAvatarUrl(profilePicUrl, authUser.fullName, authUser.username)
		: getAvatarUrl(profilePicUrl, selectedConversation?.fullName, selectedConversation?.username);
	const shakeClass = message.shouldShake ? "animate-shake" : "";

	return (
		<motion.div 
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={`flex gap-2 sm:gap-3 px-2 sm:px-4 py-1 ${fromMe ? "flex-row-reverse" : "flex-row"}`}
		>
			{/* Avatar */}
			<motion.div 
				whileHover={{ scale: 1.1 }}
				className="flex-shrink-0 cursor-pointer group"
			>
				<ProfileImage
					src={profilePic}
					alt="User avatar"
					size="w-8 h-8 sm:w-10 sm:h-10"
					initials={fromMe ? authUser?.fullName?.charAt(0).toUpperCase() || "?" : selectedConversation?.fullName?.charAt(0).toUpperCase() || "?"}
					className="ring-2 ring-transparent group-hover:ring-pink-400 transition-all shadow-sm"
				/>
			</motion.div>

			{/* Message Content */}
			<div className={`flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${fromMe ? "items-end" : "items-start"}`}>
				{/* Sender Info */}
				<div className={`text-xs text-neutral-500 dark:text-neutral-400 px-3 font-semibold ${fromMe ? "text-right" : "text-left"}`}>
					{!fromMe && selectedConversation?.username}
				</div>
				
				{/* Message Bubble */}
				<motion.div
					whileHover={{ scale: 1.02 }}
					className={`group relative px-3 sm:px-4 py-2 sm:py-3 rounded-3xl transition-all duration-200 shadow-sm hover:shadow-md w-fit ${
						fromMe
							? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xl hover:from-pink-600 hover:to-rose-600"
							: "bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 text-neutral-900 dark:text-neutral-50 rounded-bl-xl hover:shadow-lg"
					} ${message.shouldShake ? "animate-shake" : ""}`}
				>
					<p className="text-sm sm:text-base break-words leading-relaxed">{message.message}</p>
				</motion.div>

				{/* Timestamp & Status */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
					className={`flex items-center gap-1.5 mt-1 text-xs text-neutral-500 dark:text-neutral-400 px-3 ${
						fromMe ? "flex-row-reverse" : "flex-row"
					}`}
				>
					{fromMe && (
						<motion.div 
							animate={{ scale: message.seen ? 1.1 : 1 }}
							className="flex items-center"
						>
							{message.seen ? (
								<MdCheckCircle className="text-pink-500 dark:text-pink-400 text-sm" title="Seen" />
							) : (
								<MdDone className="text-neutral-400 dark:text-neutral-600 text-sm" title="Sent" />
							)}
						</motion.div>
					)}
					<span className="font-mono text-xs">{formattedTime}</span>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default Message;
