import { useState } from "react";
import { apiPost } from "../utils/api";
import toast from "react-hot-toast";

const useSavePost = () => {
	const [loading, setLoading] = useState(false);

	const savePost = async (postId) => {
		try {
			setLoading(true);
			await apiPost(`/api/posts/${postId}/save`, {});
			toast.success("Post saved!");
			return true;
		} catch (error) {
			toast.error(error.message || "Failed to save post");
			return false;
		} finally {
			setLoading(false);
		}
	};

	const unsavePost = async (postId) => {
		try {
			setLoading(true);
			await apiPost(`/api/posts/${postId}/unsave`, {});
			toast.success("Post unsaved!");
			return true;
		} catch (error) {
			toast.error(error.message || "Failed to unsave post");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { savePost, unsavePost, loading };
};

export default useSavePost;
