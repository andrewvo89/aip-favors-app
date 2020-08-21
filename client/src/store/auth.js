//auth Reducer
import { AUTH_USER_CHANGED, LOGOUT } from "../utils/constants";

const initialState = {
  authUser: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER_CHANGED:
      return {
        ...state,
        authUser: action.authUser
      }
    case LOGOUT:
      return {
        ...state,
        authUser: null
      }
    default:
      return state;
  }
}