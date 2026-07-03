const INIT_STATE = {
	initialURL: "/",
	error: "",
	message: "",
	loading: false,
	isSearchBarOpen: false,
	pageHerder: null,
	themeColor: "primary",
	// themeMode: "dark",
	themeMode: "light",
};

const reducers = (state = INIT_STATE, action) => {
	switch (action.type) {
		case "FETCH_START": {
			return {...state, error: "", message: "", loading: true};
		}
		case "FETCH_SUCCESS": {
			return {...state, error: "", loading: false};
		}
		case "SHOW_MESSAGE": {
			return {...state, error: "", message: action.payload};
		}
		case "FETCH_ERROR": {
			return {...state, loading: false, message: "", error: action.payload};
		}
		case "THEME_COLOR_CHANGE": {
			return {...state, themeColor: action.payload ? action.payload : "primary"};
		}
		case "THEME_MODE_CHANGE": {
			return {...state, themeMode: action.payload ? action.payload : "light"};
		}
		case "SET_PAGE_TITLE": {
			return {
				...state,
				pageHerder: action.payload,
			};
		}
		default:
			return state;
	}
};

export default reducers;
