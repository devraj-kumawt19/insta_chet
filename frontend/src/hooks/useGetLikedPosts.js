import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetLikedPosts = (userId) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchLikedPosts = async () => {
		if (!userId) return;

		setLoading(true);
		try {
			const data = await apiGet(`/api/posts/liked/${userId}`);
			setPosts(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching liked posts:", error.message);
			setPosts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLikedPosts();
	}, [userId]);

	return { posts, loading, refetch: fetchLikedPosts };
};

export default useGetLikedPosts;
