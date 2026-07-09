import jwtAuthAxios from "./jwtAuth";

export function GetAdminUsersListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/users", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminUsersExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/users/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res); // Return the full response for blob
			})
			.catch((error) => {
				if (cb) cb(error?.response || error);
			});
	};
}

export function GetAdminsListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/users/admins", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PostAdminUserAddServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post("/v1/admin/users", data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PutAdminUserServices(userId, data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put(`/v1/admin/users/${userId}`, data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function DeleteAdminUserServices(userId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.delete(`/v1/admin/users/${userId}`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminUserDetailsServices(userId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/users/${userId}`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminDashboardServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/dashboard`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetGenderListServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/genders")
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}
