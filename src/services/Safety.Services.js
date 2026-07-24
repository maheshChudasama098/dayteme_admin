import jwtAuthAxios from "./jwtAuth";

export function GetAdminSafetyQueueServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/safety-queue", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PostAcknowledgeSafetyIncidentServices(incidentId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post(`/v1/admin/safety-queue/${incidentId}/acknowledge`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PostResolveSafetyIncidentServices(incidentId, params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post(`/v1/admin/safety-queue/${incidentId}/resolve`, params)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetSafetyIncidentEvidenceServices(incidentId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get(`/v1/admin/safety-queue/${incidentId}/evidence`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(error?.response?.data || error);
			});
	};
}
