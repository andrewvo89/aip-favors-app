import {
	SET_ERROR,
	NETWORK_ERROR
} from '../utils/constants';
import axios from '../utils/axios';
import ErrorMessage from '../models/error-message';
import { get503Error } from '../utils/error-handler';
const config = { withCredentials: true };


const getErrorMessage = error => {
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

export const create = data => {
	return async (dispatch) => {
		try {
			const favourData = {
				fromId: data.fromId,
				fromName: data.fromName,
				forId: data.forId,
				forName: data.forName,
				act: data.act
			};

			const result = await axios.post('/favours/create', favourData, config);

			return result;
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
