import jwtAxios from "axios";
// import {logout} from "../store/authSlice";
import {apiURL, HTTP_CODE_BAD_REQUEST, HTTP_CODE_CONFLICT, HTTP_CODE_FORBIDDEN, HTTP_CODE_INTERNAL_SERVER_ERROR, HTTP_CODE_UNAUTHORIZED, HTTP_CODE_VALIDATION_ERROR} from "src/constance";
import {AuthRoutes} from "../routes/routes";

const jwtAuthAxios = jwtAxios.create({
	baseURL: apiURL,
	headers: {
		"Content-Type": "application/json",
	},
});

jwtAuthAxios.interceptors.request.use(
	(config) => {
		// Get token from localStorage and set it in headers
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Remove Content-Type for FormData so the browser sets multipart/form-data with the correct boundary
		if (config.data instanceof FormData) {
			config.headers.delete("Content-Type");
		}

		config.headers = {
			...config.headers,
		};
		return config;
	},
	(error) => Promise.reject(error),
);

jwtAuthAxios.interceptors.response.use(
	(response) => {
		if (response?.status === HTTP_CODE_UNAUTHORIZED || response?.status === HTTP_CODE_FORBIDDEN) {
			localStorage.clear();
			window.location.replace(AuthRoutes.Login);
		}
		return Promise.resolve(response);
	},
	async (err) => {
		if (err?.response?.status === HTTP_CODE_BAD_REQUEST || err?.response?.status === HTTP_CODE_CONFLICT || err?.response?.status === HTTP_CODE_INTERNAL_SERVER_ERROR) {
			return Promise.reject(err?.response?.data);
		}

		if (err?.response?.status === HTTP_CODE_INTERNAL_SERVER_ERROR || err?.response?.status === HTTP_CODE_INTERNAL_SERVER_ERROR) {
			localStorage.clear();
			window.location.replace(AuthRoutes.Login);
			return Promise.reject(err); // Ensure you return a value here
		}
		return Promise.reject(err);
	},
);

export default jwtAuthAxios;

export const setAuthToken = (token) => {
	if (token) {
		if (jwtAuthAxios.defaults.headers.common) {
			jwtAuthAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
		}
	} else {
		if (jwtAuthAxios.defaults.headers.common) {
			delete jwtAuthAxios.defaults.headers.common.Authorization;
		}
	}
};

export function errorHandler(error, dispatch) {
	if (error.response) {
		dispatch({type: "FETCH_ERROR", payload: ""});
		console.log("Error****:", error.response.data.message);
	} else {
		console.log("Error****:", error);
		dispatch({type: "FETCH_ERROR", payload: error.errors || error.message});
	}
}
