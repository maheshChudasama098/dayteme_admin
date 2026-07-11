import jwtAuthAxios from "./jwtAuth";

export function GetAdminPermissionsServices(cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.get("/v1/admin/permissions")
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminRolesServices(cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.get("/v1/admin/roles")
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PostAdminRoleServices(data, cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.post("/v1/admin/roles", data)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminRoleByIdServices(roleId, cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.get(`/v1/admin/roles/${roleId}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PutAdminRoleServices(roleId, data, cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.put(`/v1/admin/roles/${roleId}`, data)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function DeleteAdminRoleServices(roleId, cb) {
	return (dispatch) => {
		dispatch({ type: "FETCH_START" });
		jwtAuthAxios
			.delete(`/v1/admin/roles/${roleId}`)
			.then((res) => {
				dispatch({ type: "FETCH_SUCCESS" });
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({ type: "FETCH_ERROR" });
				if (cb) cb(error?.response?.data || error);
			});
	};
}
