import {
	AUTH_USER_CHANGED,
	AUTH_TOUCHED,
	LOGOUT,
	SET_ERROR,
	NETWORK_ERROR,
	CLOSE_AUTH_DIALOG,
	SHOW_LOGIN_DIALOG,
	SHOW_SIGNUP_DIALOG,
	SET_MESSAGE,
	SNACKBAR
} from '../utils/constants';
import User from '../models/user';
import ErrorMessage from '../models/error-message';
import Message from '../models/message';
import { get503Error } from '../utils/error-handler';

export const verifyAuth = () => {
	return async (dispatch, _getState) => {
		try {
			const result = await User.verifyAuth();
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
				},
				{
					type: AUTH_TOUCHED
				}
			]);
		} catch (error) {
			const errorMessage = new ErrorMessage({
				status: error.response.status,
				statusText: error.response.statusText,
				message: error.response.data.message,
				feedback: error.response.data.feedback
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
				status: error.response.status,
				statusText: error.response.statusText,
				message: error.response.data.message,
				feedback: error.response.data.feedback
			});
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

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
			const errorMessage = new ErrorMessage({
				status: error.response.status,
				statusText: error.response.statusText,
				message: error.response.data.message,
				feedback: error.response.data.feedback
			});
			dispatch({
				type: SET_ERROR,
				error: error.message === NETWORK_ERROR ? get503Error() : errorMessage
			});
			return false;
		}
	};
};

export const logout = () => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			await authUser.logout();
		} catch (error) {
			console.log(error);
			let errorMessage;
			if (error.message === NETWORK_ERROR) {
				errorMessage = get503Error();
			} else {
				errorMessage = new ErrorMessage({
					status: error.response.status,
					statusText: error.response.statusText,
					message: error.response.data.message,
					feedback: error.response.data.feedback
				});
			}
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		} finally {
			dispatch({ type: LOGOUT });
		}
	};
};

export const showLoginDialog = (resumeAction) => {
	return {
		type: SHOW_LOGIN_DIALOG,
		resumeAction
	};
};

export const showSignupDialog = () => {
	return { type: SHOW_SIGNUP_DIALOG };
};

export const closeAuthDialog = () => {
	return { type: CLOSE_AUTH_DIALOG };
};
