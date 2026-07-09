import jwtAuthAxios from "./jwtAuth";

export function GetAuditLogsService(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/activity-logs", { params })
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

export function GetAuditLogDetailsService(id, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/activity-logs/${id}`)
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
