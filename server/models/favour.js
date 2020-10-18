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
		favourType: {
			type: Schema.Types.ObjectId,
			ref: 'FavourType',
			required: true
		},
		quantity: {
			type: Number,
			required: true,
			min: 1,
			max: 100
		},
		proof: {
			type: String,
			default: '',
			required: false
		},
		repaid: {
			type: Boolean,
			default: false,
			required: true
		},
		repaidProof: {
			type: String,
			default: '',
			required: false
		},
		requestTask: {
			type: String,
			default: '',
			required: false,
			maxlength: 50
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Favour', favourSchema);
