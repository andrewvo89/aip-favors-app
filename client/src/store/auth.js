import {
	AUTH_USER_CHANGED,
	AUTH_TOUCHED,
	LOGOUT,
	CLOSE_AUTH_DIALOG,
	SHOW_LOGIN_DIALOG,
	SHOW_SIGNUP_DIALOG
} from '../utils/constants';

const initialState = {
	authUser: null,
	touched: false,
	login: false,
	signup: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case AUTH_USER_CHANGED:
			return {
				...state,
				authUser: action.authUser,
				login: false,
				signup: false
			};
		case AUTH_TOUCHED:
			return {
				...state,
				touched: true
			};
		case LOGOUT:
			return {
				...state,
				authUser: initialState.authUser
			};
		case SHOW_LOGIN_DIALOG:
			return {
				...state,
				login: true
			};
		case SHOW_SIGNUP_DIALOG:
			return {
				...state,
				signup: true
			};
		case CLOSE_AUTH_DIALOG:
			return {
				...state,
				login: initialState.login,
				signup: initialState.signup
			};
		default:
			return state;
	}
};
