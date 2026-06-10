import { useState } from "react";
import { apiPost } from "../utils/api";
import toast from "react-hot-toast";

/**
 * Hook to manage post interactions (like, comment, delete)
 */
const usePostInteractions = (postId) => {
	const [isLiking, setIsLiking] = useState(false);
	const [isCommentingLoading, setIsCommentingLoading] = useState(false);

	// Guard against undefined postId
	if (!postId) {
		console.warn("usePostInteractions called without valid postId");
		return {
			likePost: async () => { throw new Error("Invalid post ID"); },
			addComment: async () => { throw new Error("Invalid post ID"); },
			deletePost: async () => { throw new Error("Invalid post ID"); },
			isLiking: false,
			isCommentingLoading: false,
		};
	}

	const likePost = async () => {
		try {
			setIsLiking(true);
			const response = await apiPost(`/api/posts/${postId}/like`, {});
			return response;
		} catch (error) {
			console.error("Error liking post:", error);
			toast.error("Failed to like post");
			throw error;
		} finally {
			setIsLiking(false);
		}
	};

	const addComment = async (text) => {
		try {
			setIsCommentingLoading(true);
			const response = await apiPost(`/api/posts/${postId}/comment`, { text });
			return response;
		} catch (error) {
			console.error("Error adding comment:", error);
			toast.error("Failed to add comment");
			throw error;
		} finally {
			setIsCommentingLoading(false);
		}
	};

	const deletePost = async () => {
		try {
			const response = await apiPost(`/api/posts/${postId}/delete`, {});
			toast.success("Post deleted");
			return response;
		} catch (error) {
			console.error("Error deleting post:", error);
			toast.error("Failed to delete post");
			throw error;
		}
	};

	return { likePost, addComment, deletePost, isLiking, isCommentingLoading };
};

export default usePostInteractions;
