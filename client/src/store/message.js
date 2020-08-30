import { SET_MESSAGE, CLEAR_MESSAGE } from '../utils/constants';

const initialState = {
	message: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_MESSAGE:
			return {
				...state,
				message: action.message
			};
		case CLEAR_MESSAGE:
			return {
				...state,
				message: null
			};
		default:
			return state;
	}
};
