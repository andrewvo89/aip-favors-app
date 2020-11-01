import {
	AUTH_USER_CHANGED,
	AUTH_TOUCHED,
	LOGOUT,
	SET_ERROR,
	NETWORK_ERROR,
	CLOSE_AUTH_DIALOG,
	SHOW_LOGIN_DIALOG,
	SET_MESSAGE,
	SNACKBAR,
	SET_NOTIFICACTIONS
} from '../utils/constants';
import User from '../models/user';
import ErrorMessage from '../models/error-message';
import Message from '../models/message';
import { get503Error } from '../utils/error-handler';
import openSocket from 'socket.io-client';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);
//Check authentication upon app start
export const verifyAuth = () => {
	return async (dispatch, _getState) => {
		try {
			const result = await User.verifyAuth();
			const authUser = new User(result.data.authUser);
			//Once token is verified from back end, create User Object and dispatch it to redux store
			dispatch([
				{
					type: AUTH_USER_CHANGED,
					authUser
				},
				{
					type: SET_MESSAGE,
					message: new Message({
						title: 'Login Successful',
						text: `Welcome back ${authUser.firstName}`,
						feedback: SNACKBAR
					})
				},
				{
					type: AUTH_TOUCHED
				}
			]);
		} catch (error) {
			const errorMessage = new ErrorMessage({
				status: error.response?.status,
				statusText: error.response?.statusText,
				message: error.response?.data.message,
				feedback: error.response?.data.feedback
			});
			dispatch([
				{
					type: SET_ERROR,
					error: error.message === NETWORK_ERROR ? get503Error() : errorMessage
				},
				{
					type: AUTH_TOUCHED
				}
			]);
		}
	};
};
//Process action to sign up
export const signup = (values) => {
	return async (dispatch, _getState) => {
		try {
			const result = await User.signup(
				values.email,
				values.password,
				values.passwordConfirm,
				values.firstName,
				values.lastName
			);
			//If sign up is successful, log user in
			const authUser = new User(result.data.authUser);
			dispatch([
				{
					type: AUTH_USER_CHANGED,
					authUser
				},
				{
					type: SET_MESSAGE,
					message: new Message({
						title: 'Signup Successful',
						text: `Welcome ${authUser.firstName}`,
						feedback: SNACKBAR
					})
				}
			]);
			return true;
		} catch (error) {
			const errorMessage = new ErrorMessage({
				status: error.response?.status,
				statusText: error.response?.statusText,
				message: error.response?.data.message,
				feedback: error.response?.data.feedback
			});
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};
//Login action
export const login = (values) => {
	return async (dispatch, _getState) => {
		try {
			const result = await User.login(values.email, values.password);
			const authUser = new User(result.data.authUser);
			dispatch([
				{
					type: AUTH_USER_CHANGED,
					authUser
				},
				{
					type: SET_MESSAGE,
					message: new Message({
						title: 'Login Successful',
						text: `Welcome back ${authUser.firstName}`,
						feedback: SNACKBAR
					})
				}
			]);
			return true;
		} catch (error) {
			//If error thrown from back end due to failed log in credentials
			const errorMessage = new ErrorMessage({
				status: error.response?.status,
				statusText: error.response?.statusText,
				message: error.response?.data.message,
				feedback: error.response?.data.feedback
			});
			dispatch({
				type: SET_ERROR,
				error: error.message === NETWORK_ERROR ? get503Error() : errorMessage
			});
			return false;
		}
	};
};
//Remove user from redux store and clear token
export const logout = () => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			socket.removeAllListeners();
			await authUser.logout();
		} catch (error) {
			let errorMessage;
			if (error.message === NETWORK_ERROR) {
				errorMessage = get503Error();
			} else {
				errorMessage = new ErrorMessage({
					status: error.response?.status,
					statusText: error.response?.statusText,
					message: error.response?.data.message,
					feedback: error.response?.data.feedback
				});
			}
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		} finally {
			dispatch([
				{ type: LOGOUT },
				{
					type: SET_NOTIFICACTIONS,
					notifications: []
				}
			]);
		}
	};
};

export const showLoginDialog = () => {
	return { type: SHOW_LOGIN_DIALOG };
};

export const closeAuthDialog = () => {
	return { type: CLOSE_AUTH_DIALOG };
};
