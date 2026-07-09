import jwtAuthAxios from "./jwtAuth";

export function GetAdminPaymentsListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/payments", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminPaymentsExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/payments/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res);
			})
			.catch((error) => {
				if (cb) cb(error?.response || error);
			});
	};
}
