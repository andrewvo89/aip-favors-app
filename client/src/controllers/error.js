import { CLEAR_ERROR, SET_ERROR } from '../utils/constants';
import ErrorMessage from '../models/error-message';

export const clearError = () => {
	return { type: CLEAR_ERROR };
};

export const setError = (error) => {
	return {
		type: SET_ERROR,
		error: new ErrorMessage(error)
	};
};
