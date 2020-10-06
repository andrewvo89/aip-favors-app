import {
	SET_NOTIFICACTIONS,
	SET_NOTIFICACTIONS_TOUCHED
} from '../utils/constants';

const initialState = {
	notifications: [],
	touched: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_NOTIFICACTIONS:
			return {
				...state,
				notifications: action.notifications
			};
		case SET_NOTIFICACTIONS_TOUCHED:
			return {
				...state,
				touched: true
			};
		default:
			return state;
	}
};
