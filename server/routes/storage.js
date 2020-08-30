const express = require('express');
const storageController = require('../controllers/storage');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.get(
	'/users/:userId/profilePicture/:filename',
	verifyAuth,
	storageController.getProfilePicture
);

module.exports = router;
