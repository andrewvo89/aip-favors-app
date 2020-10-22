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
			required: true
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
			notifications: {
				type: Boolean,
				default: true
			},
			expandFavoursGroup: {
				type: Boolean,
				default: true
			},
			expandRequestsGroup: {
				type: Boolean,
				default: true
			}
		}
	},
	{
		timestamps: true
	}
);

// cannot be queried on the db directly
userSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
