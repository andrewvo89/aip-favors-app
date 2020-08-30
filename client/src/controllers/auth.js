import {
	AUTH_USER_CHANGED,
	AUTH_TOUCHED,
	LOGOUT,
	SET_ERROR,
	NETWORK_ERROR,
	CLOSE_AUTH_DIALOG,
	SHOW_LOGIN_DIALOG,
	SHOW_SIGNUP_DIALOG,
	CLEAR_RESUME_ACTION,
	SET_MESSAGE,
	SNACKBAR
} from '../utils/constants';
import axios from '../utils/axios';
import User from '../models/user';
import ErrorMessage from '../models/error-message';
import Message from '../models/message';
import { get503Error } from '../utils/error-handler';
const config = { withCredentials: true };

export const verifyAuth = () => {
	return async (dispatch, _getState) => {
		try {
			const result = await axios.post('/auth/verify', null, config);
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

export const signup = ({
	email,
	password,
	passwordConfirm,
	firstName,
	lastName
}) => {
	return async (dispatch, getState) => {
		try {
			const data = {
				email: email.trim().toLowerCase(),
				password,
				passwordConfirm,
				firstName: firstName.trim(),
				lastName: lastName.trim()
			};
			await axios.put('/auth/signup', data);
			const result = await axios.post('/auth/login', data, config);
			const authUser = new User(result.data.authUser);
			dispatch([
				{
					type: AUTH_USER_CHANGED,
					authUser,
					resume: !!getState().authState.resumeAction
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

export const login = ({ email, password }) => {
	return async (dispatch, getState) => {
		try {
			const data = {
				email: email.trim().toLowerCase(),
				password: password
			};
			const result = await axios.post('/auth/login', data, config);
			const authUser = new User(result.data.authUser);
			dispatch([
				{
					type: AUTH_USER_CHANGED,
					authUser,
					resume: !!getState().authState.resumeAction
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
			const data = { userId: getState().authState.authUser.userId };
			const config = { withCredentials: true }; //Do not wait for back end to clear cookies etc, just move on and clear authUser from redux store
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

export const clearResumeAction = () => {
	return async (dispatch, _getState) => {
		dispatch({ type: CLEAR_RESUME_ACTION });
	};
};
