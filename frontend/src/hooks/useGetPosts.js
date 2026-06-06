import { useState, useEffect } from "react";
import { apiCall } from "../utils/api";

const useGetPosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await apiCall("/api/posts/feed", {
					method: "GET",
				});
				setPosts(data || []);
			} catch (err) {
				console.error("Error fetching posts:", err);
				setError(err.message || "Failed to fetch posts");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	return { posts, loading, error };
};

export default useGetPosts;
