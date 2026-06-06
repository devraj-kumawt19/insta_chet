import { useState, useEffect } from "react";
import { apiGet } from "../../utils/api";
import toast from "react-hot-toast";
import Post from "./Post";
import CreatePost from "./CreatePost";

const PostFeed = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchFeed = async () => {
		try {
			setLoading(true);
			const response = await apiGet("/api/posts/feed");
			setPosts(response);
		} catch (error) {
			toast.error(error.message || "Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeed();
	}, []);

	const handlePostCreated = (newPost) => {
		setPosts([newPost, ...posts]);
	};

	const handlePostDeleted = (postId) => {
		setPosts(posts.filter(post => post._id !== postId));
	};

	return (
		<div className="max-w-2xl mx-auto px-4 py-6">
			<CreatePost onPostCreated={handlePostCreated} />

			{loading ? (
				<div className="flex justify-center items-center h-96">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
				</div>
			) : posts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-neutral-500 dark:text-neutral-400">No posts yet</p>
				</div>
			) : (
				posts.map(post => (
					<Post
						key={post._id}
						post={post}
						onDelete={handlePostDeleted}
						onLikeChange={fetchFeed}
					/>
				))
			)}
		</div>
	);
};

export default PostFeed;
