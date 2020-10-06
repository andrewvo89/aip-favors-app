const mongoose = require('mongoose');
const Notification = require('../models/notification');
const { CREATE } = require('../utils/constants');
const socket = require('../utils/socket');

module.exports.getAll = async (req, res, next) => {
	try {
		const notificationDocs = await Notification.find({
			createdBy: { $eq: res.locals.userId }
		}).sort({ createdAt: 'desc' });
		const notifications = notificationDocs.map((notification) => {
			return getNotificationForClient(notification);
		});
		res.status(200).json({ notifications: notifications });
	} catch (error) {
		next(error);
	}
};

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

const getNotificationForClient = (notification) => {
	return {
		notificationId: notification._id,
		createdAt: notification.createdAt,
		link: notification.link,
		title: notification.title
	};
};
