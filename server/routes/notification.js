const express = require('express');
const notificationsController = require('../controllers/notification');
const notificationValidator = require('../validators/notification');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.post('/get-all', verifyAuth, notificationsController.getAll);

router.delete(
	'/delete/:notificationId',
	verifyAuth,
	notificationValidator.delete,
	notificationsController.delete
);

router.delete('/deleteAll/', verifyAuth, notificationsController.deleteAll);

module.exports = router;
