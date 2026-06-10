import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetUserPosts = (userId) => {
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);

	const fetchUserPosts = async () => {
		if (!userId) {
			setPosts([]);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			console.log(`Fetching posts for user: ${userId}`);
			const data = await apiGet(`/api/posts/user/${userId}`);
			
			if (Array.isArray(data)) {
				console.log(`Found ${data.length} posts for user ${userId}`);
				setPosts(data);
			} else {
				console.warn("API returned non-array data:", data);
				setPosts([]);
			}
		} catch (err) {
			console.error("Error fetching user posts:", err.message);
			setError(err.message);
			setPosts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserPosts();
	}, [userId]);

	// Listen for post creation event to refresh posts
	useEffect(() => {
		const handlePostCreated = () => {
			console.log("Post created event received, refreshing user posts");
			fetchUserPosts();
		};

		window.addEventListener("postCreated", handlePostCreated);
		return () => window.removeEventListener("postCreated", handlePostCreated);
	}, [userId]);

	return { posts, loading, error, refetch: fetchUserPosts };
};

export default useGetUserPosts;
