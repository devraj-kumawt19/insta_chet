/**
 * Get a default avatar URL when user hasn't uploaded a profile picture
 * Uses UI Avatars service with user initials, similar to Instagram
 * @param {string} fullName - User's full name
 * @param {string} username - User's username (fallback)
 * @returns {string} Avatar URL
 */
export const getDefaultAvatar = (fullName, username) => {
	// Get initials from full name
	const initials = fullName
		? fullName
				.split(" ")
				.slice(0, 2)
				.map((n) => n.charAt(0).toUpperCase())
				.join("")
		: username?.charAt(0).toUpperCase() || "?";

	// Use UI Avatars API to generate avatar with initials
	// This creates beautiful gradient avatars similar to Instagram/Slack
	const encodedName = encodeURIComponent(initials);
	return `https://ui-avatars.com/api/?name=${encodedName}&size=200&bold=true&background=random`;
};

/**
 * Get avatar URL - uses profilePic if available, otherwise default
 * @param {string} profilePic - User's profile picture URL
 * @param {string} fullName - User's full name
 * @param {string} username - User's username (fallback)
 * @returns {string} Avatar URL to display
 */
export const getAvatarUrl = (profilePic, fullName, username) => {
	// Check if profilePic is valid (not empty, not just whitespace)
	if (profilePic && profilePic.trim() && !profilePic.includes("undefined")) {
		return profilePic;
	}
	return getDefaultAvatar(fullName, username);
};
