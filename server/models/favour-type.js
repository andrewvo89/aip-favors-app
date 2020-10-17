const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favourTypeShchema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('FavourType', favourTypeShchema);
