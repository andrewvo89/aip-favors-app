const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Notification = require('../models/notification');
const { DELETE, DELETE_ALL, CREATE, DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const socket = require('../utils/socket');

//Transoform object for client side
const getNotificationForClient = (notification) => {
	return {
		notificationId: notification._id,
		createdAt: notification.createdAt,
		link: notification.link,
		title: notification.title
	};
};
//Get all notifications for a specific user
module.exports.getAll = async (req, res, next) => {
	try {
		const docs = await Notification.find({
			recipient: { $eq: res.locals.userId }
		}).sort({ createdAt: 'desc' });
		const notifications = docs.map((notification) => {
			return getNotificationForClient(notification);
		});
		res.status(200).json({ notifications: notifications });
	} catch (error) {
		next(error);
	}
};
//Create a notification and emit it too all clients connected to socket.io
module.exports.create = async (createdBy, link, recipient, title) => {
	const notification = new Notification({
		createdBy: new mongoose.Types.ObjectId(createdBy),
		link: link,
		recipient: new mongoose.Types.ObjectId(recipient),
		title: title
	});
	await notification.save();
	socket.get().emit(`notifications-${recipient}`, {
		action: CREATE,
		notification: getNotificationForClient(notification)
	});
};
//Remove a single notification
module.exports.delete = async (req, res, next) => {
	try {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			throw getError(422, validationErrors.errors[0].msg, DIALOG);
		}
		const { notificationId } = req.params;
		const notification = await Notification.findById(
			new mongoose.Types.ObjectId(notificationId)
		);
		if (notification.recipient.toString() !== res.locals.userId) {
			//If your userId does not match the userId of the notification recipient
			throw getError(403, 'Unauthorized to delete notification', DIALOG);
		}
		await notification.deleteOne();
		socket.get().emit(`notifications-${res.locals.userId}`, {
			action: DELETE,
			notificationId: notificationId
		});
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
//Clear all notifications
module.exports.deleteAll = async (req, res, next) => {
	try {
		const { userId } = res.locals;
		await Notification.deleteMany({
			recipient: { $eq: new mongoose.Types.ObjectId(userId) }
		});
		socket.get().emit(`notifications-${userId}`, {
			action: DELETE_ALL
		});
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
