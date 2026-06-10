// Centralized API configuration for production and development

const getAPIBaseURL = () => {
	// In production (Render), use relative paths to same domain
	if (import.meta.env.PROD) {
		return ""; // Empty string = same domain
	}
	// In development, use VITE_API_URL or fallback to localhost:8080
	return import.meta.env.VITE_API_URL || "http://localhost:8080";
};

const API_BASE_URL = getAPIBaseURL();

/**
 * Make a fetch request with proper error handling and JSON parsing
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} Response data or throws error
 */
export const apiCall = async (endpoint, options = {}) => {
	const url = `${API_BASE_URL}${endpoint}`;
	
	try {
		// Check if body is FormData (for file uploads)
		const isFormData = options.body instanceof FormData;

		const fetchOptions = {
			credentials: "include", // Include cookies for auth
			...options,
		};

		// Only set Content-Type header if not FormData (FormData sets it automatically with boundary)
		if (!isFormData && !options.headers?.["Content-Type"]) {
			if (!fetchOptions.headers) fetchOptions.headers = {};
			fetchOptions.headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, fetchOptions);

		// Handle non-OK responses
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				errorData = { error: `HTTP Error: ${response.status}` };
			}
			throw new Error(errorData.error || `Request failed with status ${response.status}`);
		}

		// Handle empty responses
		const contentLength = response.headers.get("content-length");
		if (contentLength === "0" || !contentLength) {
			return null;
		}

		// Parse JSON response safely
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			throw new Error("Invalid response format from server");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`API Error [${endpoint}]:`, error);
		throw error;
	}
};

/**
 * GET request
 */
export const apiGet = (endpoint, options = {}) => {
	return apiCall(endpoint, { ...options, method: "GET" });
};

/**
 * POST request
 */
export const apiPost = (endpoint, body, options = {}) => {
	// If body is FormData, don't stringify it
	const isFormData = body instanceof FormData;
	return apiCall(endpoint, {
		...options,
		method: "POST",
		body: isFormData ? body : JSON.stringify(body),
	});
};

/**
 * PUT request
 */
export const apiPut = (endpoint, body, options = {}) => {
	const isFormData = body instanceof FormData;
	return apiCall(endpoint, {
		...options,
		method: "PUT",
		body: isFormData ? body : JSON.stringify(body),
	});
};

/**
 * DELETE request
 */
export const apiDelete = (endpoint, options = {}) => {
	return apiCall(endpoint, { ...options, method: "DELETE" });
};

/**
 * Get API URL for constructing URLs
 */
export const getAPIUrl = () => API_BASE_URL;

export default { apiCall, apiGet, apiPost, apiPut, apiDelete, getAPIUrl };
