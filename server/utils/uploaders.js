const multer = require('multer');
const fs = require('fs');
const path = require('path');

const imageFileFilter = (req, file, callback) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

module.exports.profilePictureUploader = multer({
	storage: multer.diskStorage({
		destination: (req, _file, callback) => {
			const destination = path.join(
				'storage',
				'users',
				req.body.userId,
				'profilePicture'
			);
			fs.rmdirSync(destination, { recursive: true });
			fs.mkdirSync(destination, { recursive: true });
			callback(null, destination);
		},
		filename: (_req, file, callback) => {
			callback(null, file.originalname);
		},
		fileFilter: imageFileFilter
	})
}).single('file');

module.exports.requestProofUploader = multer({
	storage: multer.diskStorage({
		destination: (req, _file, callback) => {
			const destination = path.join(
				'storage',
				'requests',
				req.body.requestId,
				'proof'
			);
			fs.mkdirSync(destination, { recursive: true });
			callback(null, destination);
		},
		filename: (_req, file, callback) => {
			callback(null, file.originalname);
		},
		fileFilter: imageFileFilter
	})
}).single('file');

module.exports.favourImageUploader = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
			const destination = path.join(
				'storage',
				'favours',
				req.body.userId,
				'proof'
			);
			// fs.rmdirSync(destination, { recursive: true });
			fs.mkdirSync(destination, { recursive: true });
			callback(null, destination);
		},
		filename: (req, file, callback) => {
			callback(null, file.originalname);
		}
	}),
	fileFilter: (req, file, callback) => {
		if (
			file.mimetype === 'image/png' ||
			file.mimetype === 'image/jpg' ||
			file.mimetype === 'image/jpeg'
		) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	}
}).single('file');
