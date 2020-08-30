const multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports.profilePictureUploader = multer({
	storage: multer.diskStorage({
		destination: (req, file, callback) => {
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
