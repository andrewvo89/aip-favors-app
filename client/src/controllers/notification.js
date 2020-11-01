import openSocket from 'socket.io-client';
import Message from '../models/message';
import Notification from '../models/notification';
import {
	CREATE,
	DELETE,
	DELETE_ALL,
	SET_ERROR,
	SET_MESSAGE,
	SET_NOTIFICACTIONS,
	SNACKBAR
} from '../utils/constants';
import { getErrorMessage } from '../utils/error-handler';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);
//Subscribe to the socket.io stream to receive notifications
export const subscribeToNotifications = () => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			const notifications = await Notification.getAll();
			dispatch({
				type: SET_NOTIFICACTIONS,
				notifications: notifications
			});
			//Subscribe to the socket.io for notification updates
			socket.on(`notifications-${authUser.userId}`, (data) => {
				//Every time there is a new notification, dispatch new notification
				let newNotifications = [...getState().notificationState.notifications];
				const actions = [];
				if (data.action === CREATE) {
					const newNotification = new Notification({ ...data.notification });
					newNotifications.unshift(newNotification);
					actions.push({
						type: SET_MESSAGE,
						message: new Message({
							title: null,
							text: newNotification.title,
							feedback: SNACKBAR
						})
					});
				} else if (data.action === DELETE) {
					const index = newNotifications.findIndex(
						(notification) =>
							notification.notificationId === data.notificationId
					);
					newNotifications.splice(index, 1);
				} else if (data.action === DELETE_ALL) {
					newNotifications = [];
				}
				actions.push({
					type: SET_NOTIFICACTIONS,
					notifications: newNotifications
				});
				dispatch(actions);
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
//Ubsubscibe to the socket.io stream to prevent memory leaks
export const unsubscribeToNotifications = () => {
	return async (dispatch, getState) => {
		const { authUser } = getState().authState;
		try {
			const socketEvent = `notifications-${authUser.userId}`;
			if (socket.hasListeners(socketEvent)) {
				socket.off(socketEvent);
			}
			dispatch({
				type: SET_NOTIFICACTIONS,
				notifications: []
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
//Delete all notifications for a user
export const clearNotifications = () => {
	return async (dispatch, _getState) => {
		try {
			await Notification.deleteAll();
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};
//Delte a single notification
export const clearNotification = (notification) => {
	return async (dispatch, _getState) => {
		try {
			await notification.delete();
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};
