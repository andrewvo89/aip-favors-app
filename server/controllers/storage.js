const fs = require('fs');
const path = require('path');
const { DIALOG } = require('../utils/constants');
const { getError } = require('../utils/error');
const rootPath = require('../utils/root-path');

module.exports.getProfilePicture = (req, res, next) => {
	try {
		const imagePath = path.join(rootPath, req.originalUrl);
		if (res.locals.userId !== req.params.userId) {
			throw getError(
				404,
				'Access denied, login credentials are invalid',
				DIALOG
			);
		}
		if (!fs.existsSync(imagePath)) {
			throw getError(404, 'Access denied, file does not exist', DIALOG);
		}
		const file = fs.createReadStream(imagePath);
		file.pipe(res);
	} catch (error) {
		next(error);
	}
};

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
