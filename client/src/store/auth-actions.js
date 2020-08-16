import { AUTH_STATE_CHANGED, LOGOUT } from "./action-types"

export const getAuthState = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: AUTH_STATE_CHANGED,
      authUser: {
        id: '123456789',
        name: 'Bobby'
      }
    });
  }
}

export const logout = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: LOGOUT
    });
  }
}