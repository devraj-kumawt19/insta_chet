import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { apiPost } from "../utils/api";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { setMessages, selectedConversation, moveConversationToTop } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const data = await apiPost(`/api/messages/send/${selectedConversation._id}`, { message });
			setMessages((currentMessages) => [...currentMessages, data]);
			moveConversationToTop(selectedConversation._id, data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
