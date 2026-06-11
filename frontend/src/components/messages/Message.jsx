import { motion } from "framer-motion";
import { MdCheck, MdDoneAll } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { ProfileImage } from "../ui/UIComponents";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = String(message.senderId) === String(authUser._id);
	const formattedTime = extractTime(message.createdAt);

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.18 }}
			className={`flex items-end gap-2 ${fromMe ? "justify-end" : "justify-start"}`}
		>
			{!fromMe && (
				<ProfileImage
					src={selectedConversation?.profilePic}
					alt={selectedConversation?.fullName}
					size="h-7 w-7"
					initials={selectedConversation?.fullName?.charAt(0).toUpperCase() || "?"}
					className="mb-4 flex-shrink-0"
				/>
			)}

			<div className={`flex max-w-[78%] flex-col sm:max-w-[68%] ${fromMe ? "items-end" : "items-start"}`}>
				<div
					className={`w-fit rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
						fromMe
							? "rounded-br-md bg-blue-600 text-white"
							: "rounded-bl-md bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
					} ${message.shouldShake ? "animate-shake" : ""}`}
				>
					<p className="break-words">{message.message}</p>
				</div>

				<div className={`mt-1 flex items-center gap-1 px-1 text-[10px] text-neutral-400 ${fromMe ? "flex-row-reverse" : ""}`}>
					<span>{formattedTime}</span>
					{fromMe &&
						(message.seen ? (
							<MdDoneAll className="text-blue-500" size={13} title="Seen" />
						) : (
							<MdCheck size={13} title="Sent" />
						))}
				</div>
			</div>
		</motion.div>
	);
};

export default Message;
