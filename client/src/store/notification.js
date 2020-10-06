import { SET_NOTIFICACTIONS } from '../utils/constants';

const initialState = {
	notifications: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_NOTIFICACTIONS:
			return {
				...state,
				notifications: action.notifications
			};
		default:
			return state;
	}
};
