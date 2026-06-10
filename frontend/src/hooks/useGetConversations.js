import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGet } from "../utils/api";
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const data = await apiGet("/api/users");
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [setConversations]);

	return { loading, conversations };
};
export default useGetConversations;
