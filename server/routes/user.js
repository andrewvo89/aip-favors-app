const express = require('express');
const userController = require('../controllers/user');
const userValidator = require('../validators/user');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');
const uploaders = require('../utils/uploaders');

router.patch(
	'/update',
	verifyAuth,
	userValidator.update,
	userController.update
);

router.patch(
	'/update-password',
	verifyAuth,
	userValidator.updatePassword,
	userController.updatePassword
);

// router.patch(
// 	'/update-settings',
// 	verifyAuth,
// 	userValidator.updateSettings,
// 	userController.updateSettings
// );

router.patch(
	'/upload-picture',
	verifyAuth,
	uploaders.profilePictureUploader,
	userController.uploadPicture
);

router.delete('/remove-picture', verifyAuth, userController.removePicture);

router.post('/get-users', userController.getUsers);

module.exports = router;
