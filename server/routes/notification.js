const express = require('express');
const notificationsController = require('../controllers/notification');
// const notificationValidator = require('../validators/notification');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.get(
	'/get-notifications',
	verifyAuth,
	notificationsController.getNotifications
);
