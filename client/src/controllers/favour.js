import ErrorMessage from '../models/error-message';
import Message from '../models/message';
import Favour from '../models/favour';
import {
	NETWORK_ERROR,
	SET_ERROR,
	SET_MESSAGE,
	SNACKBAR
} from '../utils/constants';
import { get503Error } from '../utils/error-handler';

const getErrorMessage = (error) => {
	if (error.message === NETWORK_ERROR) {
		return get503Error();
	} else {
		return new ErrorMessage({
			status: error.response?.status,
			statusText: error.response?.statusText,
			message: error.response?.data.message,
			feedback: error.response?.data.feedback
		});
	}
};

const dispatchError = (error, dispatch) => {
	dispatch({
		type: SET_ERROR,
		error: getErrorMessage(error)
	});
};
//Create action for favours
export const create = (data) => {
	return async (dispatch) => {
		try {
			const result = await Favour.create(data);
			dispatch({
				type: SET_MESSAGE,
				message: new Message({
					title: 'Favour created!',
					text: 'The new favour has been created successfully.',
					feedback: SNACKBAR
				})
			});

			return result;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
//Get all favours from the back end
export const getAllFavours = () => {
	return async (dispatch) => {
		try {
			const result = await Favour.getAllFavours();

			return result;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
//Get a single Favour based on favourId
export const getFavour = (favourId) => {
	return async (dispatch) => {
		try {
			const result = await Favour.getFavour(favourId);

			return result;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
//Repay action for a favour
export const repay = (data) => {
	return async (dispatch) => {
		try {
			const result = await Favour.repay(data);
			dispatch({
				type: SET_MESSAGE,
				message: new Message({
					title: 'Favour repaid!',
					text: 'You have repaid the favour.',
					feedback: SNACKBAR
				})
			});

			return result;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
//Get the entire leaderboard to display on the view
export const getLeaderboard = () => {
	return async (dispatch) => {
		try {
			const result = await Favour.getLeaderboard();
			return result;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
//Upload proof action
export const uploadImage = (file) => {
	return async (dispatch, getState) => {
		try {
			const userId = getState().authState.authUser.userId;

			const imageUrl = await Favour.uploadImage({ file, userId });
			return imageUrl;
		} catch (error) {
			dispatchError(error, dispatch);
			return false;
		}
	};
};
