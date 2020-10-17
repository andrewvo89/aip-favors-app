import { SET_FAVOUR_TYPES } from '../utils/constants';

const initialState = {
	favourTypes: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_FAVOUR_TYPES:
			return {
				...state,
				favourTypes: action.favourTypes
			};
		default:
			return state;
	}
};
