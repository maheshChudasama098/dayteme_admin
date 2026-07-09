import jwtAuthAxios from "./jwtAuth";

export function GetAdminVenuesListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/venues", {params})
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

export function GetAdminVenuesExportServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/venues/export", {params, responseType: "blob"})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res);
			})
			.catch((error) => {
				dispatch({type: "FETCH_ERROR"});
				if (cb) cb(error?.response || error);
			});
	};
}

export function CreateAdminVenueServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post("/v1/admin/venues", data)
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

export function GetAdminVenueDetailsServices(venueId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/venues/${venueId}`)
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

export function UpdateAdminVenueServices(venueId, data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put(`/v1/admin/venues/${venueId}`, data)
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

export function DeleteAdminVenueServices(venueId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.delete(`/v1/admin/venues/${venueId}`)
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
