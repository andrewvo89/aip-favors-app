const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	favorname: {
		type: String,
		required: true,
	}
},{
	timestamps: true
});

const Favourstypes = mongoose.model('favourstypes',userSchema);

module.exports = Favourstypes;