import {
	SET_ERROR,
	NETWORK_ERROR,
	AUTH_USER_CHANGED
} from '../utils/constants';
import ErrorMessage from '../models/error-message';
import { get503Error } from '../utils/error-handler';
import User from '../models/user';

const getErrorMessage = (error) => {
	if (error.message === NETWORK_ERROR) {
		return get503Error();
	} else {
		return new ErrorMessage({
			status: error.response.status,
			statusText: error.response.statusText,
			message: error.response.data.message,
			feedback: error.response.data.feedback
		});
	}
};

export const update = (values) => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			//Spread existing values of authUser, then overwrite with anything from values parameter
			const newAuthUser = new User({
				...authUser,
				...values
			});
			await newAuthUser.save();
			dispatch({
				type: AUTH_USER_CHANGED,
				authUser: newAuthUser
			});
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const updatePassword = (values) => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			await authUser.savePassword(values);
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const uploadPicture = (file) => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			const newAuthUser = new User({
				...authUser
			});
			await newAuthUser.uploadProfilePicture(file);
			dispatch({
				type: AUTH_USER_CHANGED,
				authUser: newAuthUser
			});
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};

export const removePicture = () => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			const newAuthUser = new User({
				...authUser
			});
			await newAuthUser.removePicture();
			dispatch({
				type: AUTH_USER_CHANGED,
				authUser: newAuthUser
			});
		} catch (error) {
			const errorMessage = getErrorMessage(error);

			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};

export const getUsers = (filter) => {
	return async (dispatch) => {
		try {
			let transformedFilter = {};
			if (filter) {
				transformedFilter = filter;
			}
			// TODO: maybe implement filter to grab specific users
			// instead of returning all? e.g.:
			// { firtName: 'David', email: 'blah@example.com' }
			// const result = await axios.get('/user/get-users', config);
			const users = await User.get(transformedFilter);
			return users;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};
