export const setPagination = (module, data) => ({
	type: "SET_PAGINATION",
	payload: {
		module,
		data,
	},
});

export const resetPagination = (module) => ({
	type: "RESET_PAGINATION",
	payload: module,
});
