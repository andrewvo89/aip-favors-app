import { AUTH_STATE_CHANGED, LOGIN, LOGOUT } from "../global/action-types";
import axios from '../utils/axios';
import User from "../models/user";

export const verifyAuth = () => {
  return async (dispatch, getState) => {
    const config = {
      withCredentials: true
    }
    const result = await axios.post('/auth/verify', null, config);
    dispatch({
      type: AUTH_STATE_CHANGED,
      authUser: result.data.authUser
    });
  }
}

export const login = ({ email, password }) => {
  return async (dispatch, getState) => {
    const data = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
    const config = {
      withCredentials: true
    }
    const result = await axios.post('/auth/login', data, config);
    console.log(result);
    if (result.status === 422) {
      throw new Error('Validation failed.');
    }
    if (result.status !== 200 && result.status !== 201) {
      throw new Error('Could not authenticate you!');
    }
    const authUser = new User({
      userId: result.userId,
      token: result.token
    });
    dispatch({
      type: LOGIN,
      authUser: authUser
    });
  };
}

export const logout = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: LOGOUT
    });
  }
}