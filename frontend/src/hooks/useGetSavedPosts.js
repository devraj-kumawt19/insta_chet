import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetSavedPosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchSavedPosts = async () => {
		setLoading(true);
		try {
			const data = await apiGet("/api/posts/saved/all");
			setPosts(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching saved posts:", error.message);
			setPosts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSavedPosts();
	}, []);

	return { posts, loading, refetch: fetchSavedPosts };
};

export default useGetSavedPosts;
