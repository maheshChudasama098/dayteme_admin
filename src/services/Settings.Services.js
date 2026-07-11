import jwtAuthAxios from "./jwtAuth";

export function GetAdminSettingsServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/settings")
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

export function UpdateAdminSettingServices(key, data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put(`/v1/admin/settings/${key}`, data)
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
