const initialState = {
  token: localStorage.getItem("access_token") || null,
  userDetails: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })(),
  permissions: (() => {
    try {
      return JSON.parse(localStorage.getItem("permissions")) || [];
    } catch {
      return [];
    }
  })(),
};

const authReducers = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        token: action?.token,
      };
    case "USER_DETAILS":
      return {
        ...state,
        userDetails: action?.details,
      };
    case "USER_PERMISSION":
      return {
        ...state,
        permissions: action?.permissions,
      };
    case "USER_REMOVE":
      return {
        ...state,
        token: null,
        userDetails: {},
        permissions: [],
      };
    default:
      return state;
  }
};

export default authReducers;
