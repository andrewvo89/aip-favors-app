const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		act: {
			type: String,
			required: true,
			maxlength: 50
		},
		//To be implemented later when Ding created the FavourTypes
		// favourTypes: [
		// 	{
		// 		favourType: {
		// 			type: Schema.Types.ObjectId,
		// 			ref: 'FavourType',
		// 			required: true
		// 		}
		// 	}
		// ],
		rewards: [
			{
				favourType: {
					type: String,
					required: true
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
					max: 10
				},
				createdBy: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true
				}
			}
		],
		complete: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Request', requestSchema);
