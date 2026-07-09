import jwtAuthAxios from "./jwtAuth";

export function GetAdminTasksListServices(params, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/admin/tasks", {params})
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PostAdminTaskAddServices(data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.post("/v1/admin/tasks", data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function PutAdminTaskServices(taskId, data, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.put(`/v1/admin/tasks/${taskId}`, data)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function DeleteAdminTaskServices(taskId, cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.delete(`/v1/admin/tasks/${taskId}`)
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetTaskPriorityListServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/constants/task-priority")
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}

export function GetTaskStatusListServices(cb) {
	return (dispatch) => {
		dispatch({type: "FETCH_START"});
		jwtAuthAxios
			.get("/v1/constants/task-status")
			.then((res) => {
				dispatch({type: "FETCH_SUCCESS"});
				if (cb) cb(res.data);
			})
			.catch((error) => {
				if (cb) cb(error?.response?.data || error);
			});
	};
}
