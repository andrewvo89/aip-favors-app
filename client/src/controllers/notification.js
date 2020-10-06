import openSocket from 'socket.io-client';
import Notification from '../models/notification';
import {
	CREATE,
	DELETE,
	SET_ERROR,
	SET_NOTIFICACTIONS
} from '../utils/constants';
import { getErrorMessage } from '../utils/error-handler';
const { REACT_APP_REST_URL: REST_URL } = process.env;
const socket = openSocket(REST_URL);

export const clearNotifications = () => {};
export const clearNotification = () => {};

export const subscribeToNotifications = () => {
	return async (dispatch, getState) => {
		try {
			const { authUser } = getState().authState;
			const notifications = await Notification.getAll(authUser.userId);
			dispatch({
				type: SET_NOTIFICACTIONS,
				notifications: notifications
			});
			//Subscribe to the socket.io for notification updates
			dispatch(unsubscribeToNotifications(authUser.userId));
			socket.on(`notifications-${authUser.userId}`, (data) => {
				let newNotifications = [...getState().notificationState.notifications];
				console.log(newNotifications);
				if (data.action === CREATE) {
					const newNotification = new Notification({ ...data.notification });
					newNotifications.unshift(newNotification);
				} else if (data.action === DELETE) {
					const index = newNotifications.findIndex(
						(notification) =>
							notification.notificationId === data.notificationId
					);
					newNotifications.splice(index, 1);
				}
				dispatch({
					type: SET_NOTIFICACTIONS,
					notifications: newNotifications
				});
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

export const unsubscribeToNotifications = (userId) => {
	return async (dispatch, _getState) => {
		try {
			const socketEvent = `notifications-${userId}`;
			if (socket.hasListeners(socketEvent)) {
				socket.off(socketEvent);
			}
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};
