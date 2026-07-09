import jwtAuthAxios from "./jwtAuth";

export function GetLocationsListServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/constants/location")
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminLocationsListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/locations", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetAdminLocationsExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/locations/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res);
			})
			.catch((error) => {
				if (cb) cb(error?.response || error);
			});
	};
}

export function PostAdminLocationsListServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post("/v1/admin/locations", data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PutAdminLocationsListServices(locationId, data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put(`/v1/admin/locations/${locationId}`, data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function DeleteAdminLocationServices(locationId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.delete(`/v1/admin/locations/${locationId}`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}
