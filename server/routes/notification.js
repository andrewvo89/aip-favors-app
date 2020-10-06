const express = require('express');
const notificationsController = require('../controllers/notification');
// const notificationValidator = require('../validators/notification');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.post('/get-all', verifyAuth, notificationsController.getAll);

module.exports = router;
