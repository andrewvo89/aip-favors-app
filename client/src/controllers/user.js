import { SET_ERROR, NETWORK_ERROR, AUTH_USER_CHANGED } from "../utils/constants";
import axios from '../utils/axios';
import ErrorMessage from "../models/error-message";
import { get503Error } from "../utils/error-handler";
import Compressor from 'compressorjs';
const config = { withCredentials: true };

export const update = ({ email, firstName, lastName }) => {
  return async (dispatch, getState) => {
    try {
      const data = {
        userId: getState().authState.authUser.userId,
        email,
        firstName,
        lastName
      }
      await axios.patch('/user/update', data, config);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser: {
          ...getState().authState.authUser,
          email,
          firstName,
          lastName
        }
      });
      return true;
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
    }
  }
}

export const updateSettings = settings => {
  return async (dispatch, getState) => {
    try {
      const data = {
        userId: getState().authState.authUser.userId,
        settings
      };
      await axios.patch('/user/update-settings', data, config);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser: {
          ...getState().authState.authUser,
          settings
        }
      });
      return true;
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
    }
  }
}

export const uploadPicture = file => {
  return async (dispatch, getState) => {
    try {
      const reizedFile = await new Promise((resolve, reject) => {
        return new Compressor(file, {
          width: 400,
          success: result => {
            resolve(new File([result], file.name, {
              type: file.type,
              lastModified: file.lastModified
            }));
          },
          error: error => reject(error)
        })
      });
      const data = new FormData();
      data.append('userId', getState().authState.authUser.userId);
      data.append('file', reizedFile);
      const result = await axios.patch('/user/upload-picture', data, config);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser: {
          ...getState().authState.authUser,
          profilePicture: result.data.profilePicture
        }
      });
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
    }
  }
};

export const removePicture = () => {
  return async (dispatch, getState) => {
    try {
      await axios.delete('/user/remove-picture', config);
      dispatch({
        type: AUTH_USER_CHANGED,
        authUser: {
          ...getState().authState.authUser,
          profilePicture: ""
        }
      });
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
    }
  }
};