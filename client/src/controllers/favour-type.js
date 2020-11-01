import FavourType from '../models/favour-type';
import { SET_ERROR, SET_FAVOUR_TYPES } from '../utils/constants';
import { getErrorMessage } from '../utils/error-handler';
//Get all favour types from back end to use throughout the app
export const getFavourTypes = () => {
	return async (dispatch, _getState) => {
		try {
			const favourTypes = await FavourType.getAll();
			dispatch({
				type: SET_FAVOUR_TYPES,
				favourTypes: favourTypes
			});
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
