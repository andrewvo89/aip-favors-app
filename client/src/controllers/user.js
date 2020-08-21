import { SET_ERROR, NETWORK_ERROR, AUTH_USER_CHANGED } from "../utils/constants";
import axios from '../utils/axios';
import ErrorMessage from "../models/error-message";
import { get503Error } from "../utils/error-handler";
import User from "../models/user";
const config = { withCredentials: true };

export const update = ({ email, firstName, lastName }) => {
  return async (dispatch, getState) => {
    try {
      const updatedUser = new User(
        getState().authState.authUser.userId,
        email,
        firstName,
        lastName
      );
      const result = await axios.patch('/user/update', updatedUser, config);
      const authUser = new User(
        result.data.authUser.userId,
        result.data.authUser.email,
        result.data.authUser.firstName,
        result.data.authUser.lastName
      );
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser
      });
      return true;
    } catch (error) {
      let errorMessage;
      if (error.message === NETWORK_ERROR) {
        errorMessage = get503Error();
      } else {
        errorMessage = new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        );
      }
      dispatch({
        type: SET_ERROR,
        error: errorMessage
      });
      return false;
    }
  }
}

export const updatePassword = ({ currentPassword, password, passwordConfirm }) => {
  return async (dispatch, getState) => {
    try {
      const data = {
        userId: getState().authState.authUser.userId,
        currentPassword,
        password,
        passwordConfirm
      };
      await axios.patch('/user/update-password', data, config);
      return true;
    } catch (error) {
      let errorMessage;
      if (error.message === NETWORK_ERROR) {
        errorMessage = get503Error();
      } else {
        errorMessage = new ErrorMessage(
          error.response.status,
          error.response.statusText,
          error.response.data.message,
          error.response.data.feedback
        );
      }
      dispatch({
        type: SET_ERROR,
        error: errorMessage
      });
    }
  }
}