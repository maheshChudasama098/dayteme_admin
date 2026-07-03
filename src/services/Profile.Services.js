import jwtAuthAxios from "./jwtAuth";

export function UpdateProfileServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put("/v1/admin/profile", data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_ERROR"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function ChangePasswordServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put("/v1/admin/profile/change-password", data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_ERROR"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}
