//auth Reducer
import { AUTH_STATE_CHANGED, LOGOUT } from "./action-types";

const initialState = {
  authUser: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_STATE_CHANGED:
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