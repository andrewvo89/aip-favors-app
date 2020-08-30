const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			maxlength: 100
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 50
		},
		firstName: {
			type: String,
			required: true,
			maxlength: 50
		},
		lastName: {
			type: String,
			required: true,
			maxlength: 50
		},
		profilePicture: {
			type: String,
			default: ''
		},
		settings: {
			darkMode: {
				type: Boolean,
				default: false
			},
			emailNotifications: {
				type: Boolean,
				default: true
			},
			appNotifications: {
				type: Boolean,
				default: true
			}
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('User', userSchema);
