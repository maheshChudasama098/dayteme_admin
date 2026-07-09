import jwtAuthAxios from "./jwtAuth";

export function GetAdminDatesListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/dates", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminDatesExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/dates/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res);
			})
			.catch((error) => {
				if (cb) cb(error?.response || error);
			});
	};
}

export function GetAdminDateDetailsServices(dateId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/dates/${dateId}`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminDateRatingsServices(dateId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/dates/${dateId}/ratings`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminDateRatingsListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/date-ratings", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminDateRatingsExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/date-ratings/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res);
			})
			.catch((error) => {
				if (cb) cb(error?.response || error);
			});
	};
}
