import { AUTH_USER_CHANGED, LOGOUT, SET_ERROR, NETWORK_ERROR } from "../utils/constants";
import axios from '../utils/axios';
import User from "../models/user";
import ErrorMessage from "../models/error-message";
import { get503Error } from "../utils/error-handler";
const config = { withCredentials: true };

export const verifyAuth = () => {
  return async (dispatch, getState) => {
    try {
      const result = await axios.post('/auth/verify', null, config);
      const authUser = new User(result.data.authUser);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: SET_ERROR,
        error: error.message === NETWORK_ERROR
          ? get503Error()
          : new ErrorMessage({
            status: error.response.status,
            statusText: error.response.statusText,
            message: error.response.data.message,
            feedback: error.response.data.feedback
          })
      });
    }
  }
}

export const signup = ({ email, password, passwordConfirm, firstName, lastName }) => {
  return async (dispatch, getState) => {
    try {
      const data = {
        email: email.trim().toLowerCase(),
        password,
        passwordConfirm,
        firstName: firstName.trim(),
        lastName: lastName.trim()
      }
      await axios.put('/auth/signup', data);
      const result = await axios.post('/auth/login', data, config);
      const authUser = new User(result.data.authUser);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser
      });
      return true;
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: error.message === NETWORK_ERROR
          ? get503Error()
          : new ErrorMessage({
            status: error.response.status,
            statusText: error.response.statusText,
            message: error.response.data.message,
            feedback: error.response.data.feedback
          })
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
        password: password
      };
      const result = await axios.post('/auth/login', data, config);
      const authUser = new User(result.data.authUser);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser
      });
      return true;
    } catch (error) {
      dispatch({
        type: SET_ERROR,
        error: error.message === NETWORK_ERROR
          ? get503Error()
          : new ErrorMessage({
            status: error.response.status,
            statusText: error.response.statusText,
            message: error.response.data.message,
            feedback: error.response.data.feedback
          })
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
      let errorMessage;
      if (error.message === NETWORK_ERROR) {
        errorMessage = get503Error();
      } else {
        errorMessage = new ErrorMessage({
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data.message,
          feedback: error.response.data.feedback
        })
      }
      dispatch({
        type: SET_ERROR,
        error: errorMessage
      });
    } finally {
      dispatch({ type: LOGOUT });
    }
  }
}