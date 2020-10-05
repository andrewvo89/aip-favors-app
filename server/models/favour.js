const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favourSchema = new Schema(
	{
		fromUser: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		forUser: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		act: {
			type: String,
			required: true,
			maxlength: 50
		},
		repaid: {
			type: Boolean,
			default: false,
			required: true
		},
		proof: {
			actImage: {
				type: String,
				default: '',
				required: false
			},
			repaidImage: {
				type: String,
				default: '',
				required: false
			}
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Favour', favourSchema);
