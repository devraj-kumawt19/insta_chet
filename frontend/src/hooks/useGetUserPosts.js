import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetUserPosts = (userId) => {
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		if (!userId) return;

		const getUserPosts = async () => {
			setLoading(true);
			try {
				const data = await apiGet(`/api/posts/user/${userId}`);
				setPosts(Array.isArray(data) ? data : []);
			} catch (error) {
				console.error("Error fetching user posts:", error.message);
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		getUserPosts();
	}, [userId]);

	return { posts, loading };
};

export default useGetUserPosts;
