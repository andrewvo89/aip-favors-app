const fs = require('fs');
const path = require('path');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const rootPath = require('../utils/root-path');
//Get uploaded profile picture from the file system and serve it
module.exports.getProfilePicture = (req, res, next) => {
	try {
		const imagePath = path.join(rootPath, req.originalUrl);
		if (!fs.existsSync(imagePath)) {
			throw getError(404, 'Access denied, file does not exist', DIALOG);
		}
		const file = fs.createReadStream(imagePath);
		file.pipe(res);
	} catch (error) {
		next(error);
	}
};
//Get request proof image from the file system and serve it
module.exports.getRequestProofImage = (req, res, next) => {
	try {
		const imagePath = path.join(rootPath, req.originalUrl);
		if (!fs.existsSync(imagePath)) {
			throw getError(404, 'Access denied, file does not exist', DIALOG);
		}
		const file = fs.createReadStream(imagePath);
		file.pipe(res);
	} catch (error) {
		next(error);
	}
};
//Get proof image from the file system and serve it
module.exports.getProofImage = (req, res, next) => {
	try {
		const imagePath = path.join(rootPath, req.originalUrl);
		if (!fs.existsSync(imagePath)) {
			throw getError(404, 'File does not exist', DIALOG);
		}
		const file = fs.createReadStream(imagePath);
		file.pipe(res);
	} catch (error) {
		next(error);
	}
};
