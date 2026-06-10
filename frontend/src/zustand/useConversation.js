import { create } from "zustand";

const getConversationTime = (conversation) => {
	const timestamp =
		conversation?.lastMessageAt ||
		conversation?.lastMessage?.createdAt ||
		conversation?.updatedAt ||
		conversation?.createdAt;

	return timestamp ? new Date(timestamp).getTime() || 0 : 0;
};

const sortByLatestMessage = (conversations = []) =>
	[...conversations]
		.map((conversation, index) => ({ conversation, index }))
		.sort(
			(a, b) =>
				getConversationTime(b.conversation) - getConversationTime(a.conversation) ||
				a.index - b.index
		)
		.map(({ conversation }) => conversation);

const isSameId = (firstId, secondId) =>
	firstId && secondId && String(firstId) === String(secondId);

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) =>
		set((state) => ({
			selectedConversation,
			conversations: selectedConversation
				? state.conversations.map((conversation) =>
					isSameId(conversation._id, selectedConversation._id)
						? { ...conversation, hasUnread: false }
						: conversation
				)
				: state.conversations,
		})),
	messages: [],
	setMessages: (messages) =>
		set((state) => ({
			messages: typeof messages === "function" ? messages(state.messages) : messages,
		})),
	conversations: [],
	setConversations: (conversations) =>
		set({ conversations: sortByLatestMessage(Array.isArray(conversations) ? conversations : []) }),
	moveConversationToTop: (conversationId, lastMessage) =>
		set((state) => {
			const currentConversation = state.conversations.find((conversation) =>
				isSameId(conversation._id, conversationId)
			);

			if (!currentConversation) return state;

			const isSelected = isSameId(state.selectedConversation?._id, conversationId);
			const isIncomingMessage = isSameId(lastMessage?.senderId, conversationId);
			const updatedConversation = {
				...currentConversation,
				lastMessage,
				lastMessageAt: lastMessage?.createdAt || new Date().toISOString(),
				hasUnread: isIncomingMessage && !isSelected ? true : currentConversation.hasUnread && !isSelected,
			};

			return {
				conversations: [
					updatedConversation,
					...state.conversations.filter((conversation) => !isSameId(conversation._id, conversationId)),
				],
			};
		}),
}));

export default useConversation;
