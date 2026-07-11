// import {setAuthToken} from "../services/jwtAuth";
import {imageUlr} from "src/constance";
import {AuthRoutes} from "../routes/routes";

export const isAuthenticated = () => {
	// const token = localStorage.getItem("access_token");
	// return !!token;
	return true;
};

export const getCurrentUser = () => {
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};

export const getCurrentToken = () => localStorage.getItem("access_token");

export const initializeAuth = () => {
	const token = localStorage.getItem("access_token");
	if (token) {
		// setAuthToken(token);
		return true;
	}
	return false;
};

export const clearAuth = () => {
	localStorage.removeItem("access_token");
	localStorage.removeItem("user");
	localStorage.removeItem("permissions");
};

export const logout = () => {
	clearAuth();
	window.location.href = imageUlr + AuthRoutes.Login;
};
