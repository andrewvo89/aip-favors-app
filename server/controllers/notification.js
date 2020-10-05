const mongoose = require('mongoose');
const Notification = require('../models/notification');
const { CREATE } = require('../utils/constants');
const socket = require('../utils/socket');

module.exports.getNotifications = async (req, res, next) => {
	try {
		const notificationDocs = await Notification.find({
			createdBy: { $eq: res.locals.userId }
		})
			.populate('createdBy', '_id, firstName, lastName, profilePicture')
			.sort({ createdAt: 'desc' });
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
	await notification.execPopulate(
		'createdBy',
		'_id, firstName, lastName, profilePicture'
	);
	socket.get().emit('requests', {
		action: CREATE,
		request: getNotificationForClient(notification)
	});
};

const getNotificationForClient = (notification) => {
	return {
		notificationId: notification._id,
		createdBy: {
			userId: notification.createdBy._id,
			firstName: notification.createdBy.firstName,
			lastName: notification.createdBy.lastName,
			profilePicture: notification.createdBy.profilePicture
		},
		createdAt: notification.createdAt,
		link: notification.link,
		recipient: notification.recipient.toString(),
		title: notification.title
	};
};
