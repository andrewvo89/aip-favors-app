const express = require('express');
const storageController = require('../controllers/storage');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.get(
	'/users/:userId/profilePicture/:filename',
	verifyAuth,
	storageController.getProfilePicture
);

router.get(
	'/favours/:userId/proof/:filename',
	verifyAuth,
	storageController.getProofImage
);

module.exports = router;
