const express = require('express');
const requestController = require('../controllers/request');
const requestValidator = require('../validators/request');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.post('/get-requests', requestController.getRequests);

router.post(
	'/create',
	verifyAuth,
	requestValidator.create,
	requestController.create
);

router.patch(
	'/add-reward',
	verifyAuth,
	requestValidator.addReward,
	requestController.addReward
);

module.exports = router;
