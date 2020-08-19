import { AUTH_STATE_CHANGED, LOGOUT, SET_ERROR } from "../utils/constants";
import axios from '../utils/axios';
import User from "../models/user";
import ErrorMessage from "../models/error-message";

export const verifyAuth = () => {
  return async (dispatch, getState) => {
    try {
      const config = {
        withCredentials: true
      }
      const result = await axios.post('/auth/verify', null, config);
      const authUser = new User(
        result.data.authUser.userId,
        result.data.authUser.email,
        result.data.authUser.firstName,
        result.data.authUser.lastName
      );
      dispatch({
        type: AUTH_STATE_CHANGED,
        authUser: authUser
      });
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        )
      });
    }
  }
}

export const signup = ({ email, password, firstName, lastName }) => {
  return async (dispatch, getState) => {
    try {
      const data = {
        email,
        password,
        firstName,
        lastName
      };
      const config = {
        withCredentials: true
      };
      await axios.put('/auth/signup', data);
      const result = await axios.post('/auth/login', data, config);
      const authUser = new User(
        result.data.authUser.userId,
        result.data.authUser.email,
        result.data.authUser.firstName,
        result.data.authUser.lastName
      );
      dispatch({
        type: AUTH_STATE_CHANGED,
        authUser
      });
      return true;
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        )
      });
      return false;
    }
  }
}

export const login = ({ email, password }) => {
  return async (dispatch, getState) => {
    try {
      const data = {
        email: email.trim().toLowerCase(),
        password: password.trim()
      };
      const config = {
        withCredentials: true
      };
      const result = await axios.post('/auth/login', data, config);
      const authUser = new User(
        result.data.authUser.userId,
        result.data.authUser.email,
        result.data.authUser.firstName,
        result.data.authUser.lastName
      );
      dispatch({
        type: AUTH_STATE_CHANGED,
        authUser
      });
      return true;
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        )
      });
      return false;
    }
  };
}

export const logout = () => {
  return async (dispatch, getState) => {
    try {
      const data = { userId: getState().authState.authUser.userId }
      const config = { withCredentials: true };//Do not wait for back end to clear cookies etc, just move on and clear authUser from redux store
      axios.post('/auth/logout', data, config);
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        )
      });
    } finally {
      dispatch({ type: LOGOUT });
    }
  }
}