const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { REFRESH_TOKEN_EXPIRY } = process.env;

const tokenSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		accessToken: {
			type: String,
			required: true
		},
		refreshToken: {
			type: String,
			required: true
		},
		createdAt: {
			type: Date,
			expires: REFRESH_TOKEN_EXPIRY,
			default: Date.now
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Token', tokenSchema);
