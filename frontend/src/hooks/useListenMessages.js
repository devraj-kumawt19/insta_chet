import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const isSameId = (firstId, secondId) =>
	firstId && secondId && String(firstId) === String(secondId);

const getConversationUserId = (message, authUserId) => {
	if (!message || !authUserId) return null;

	return isSameId(message.senderId, authUserId) ? message.receiverId : message.senderId;
};

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { authUser } = useAuthContext();
	const { setMessages, selectedConversation, moveConversationToTop } = useConversation();

	useEffect(() => {
		if (!socket || !authUser?._id) return;

		const handleNewMessage = (newMessage) => {
			const messageWithShake = { ...newMessage, shouldShake: true };
			const conversationUserId = getConversationUserId(messageWithShake, authUser._id);

			moveConversationToTop(conversationUserId, messageWithShake);

			if (isSameId(selectedConversation?._id, conversationUserId)) {
				setMessages((currentMessages) => [...currentMessages, messageWithShake]);
			}

			const sound = new Audio(notificationSound);
			sound.play().catch(() => {});
		};

		socket.on("newMessage", handleNewMessage);

		return () => socket.off("newMessage", handleNewMessage);
	}, [socket, authUser?._id, selectedConversation?._id, setMessages, moveConversationToTop]);
};
export default useListenMessages;
