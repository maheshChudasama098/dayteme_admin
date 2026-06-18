const initialState = {
  token: null,
  userDetails: {},
  permissions: [],
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
    default:
      return state;
  }
};

export default authReducers;
