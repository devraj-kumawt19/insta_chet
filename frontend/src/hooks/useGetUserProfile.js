import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetUserProfile = (userId) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const fetchUser = async () => {
		if (!userId) return;

		setLoading(true);
		setError(null);
		try {
			console.log(`Fetching user profile for: ${userId}`);
			const data = await apiGet(`/api/users/profile/${userId}`);
			if (data) {
				console.log("User data fetched:", data);
				setUser(data);
			} else {
				setUser(null);
			}
		} catch (err) {
			console.error("Error fetching user profile:", err.message);
			setError(err.message);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, [userId]);

	// Listen for profile updates
	useEffect(() => {
		const handleProfileUpdated = () => {
			console.log("Profile updated, refetching...");
			fetchUser();
		};

		window.addEventListener("profileUpdated", handleProfileUpdated);
		return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
	}, [userId]);

	return { user, loading, error, refetch: fetchUser };
};

export default useGetUserProfile;
