const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		link: {
			type: String,
			required: true,
			maxlength: 100
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		title: {
			type: String,
			required: true,
			maxlength: 100
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Notification', notificationSchema);
