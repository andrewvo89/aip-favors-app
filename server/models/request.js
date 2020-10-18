const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		task: {
			type: String,
			required: true,
			maxlength: 50
		},
		rewards: [
			{
				fromUser: {
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
				}
			}
		],
		completed: {
			type: Boolean,
			default: false
		},
		completedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		proof: {
			type: String,
			default: ''
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Request', requestSchema);
