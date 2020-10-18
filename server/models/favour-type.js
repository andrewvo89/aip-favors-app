const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favourTypeShchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 50
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('FavourType', favourTypeShchema);
