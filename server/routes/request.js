const express = require('express');
const requestController = require('../controllers/request');
const requestValidator = require('../validators/request');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');
const uploaders = require('../utils/uploaders');

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

router.patch(
	'/delete-reward',
	verifyAuth,
	requestValidator.deleteReward,
	requestController.deleteReward
);

router.patch(
	'/udpate-reward-quantity',
	verifyAuth,
	requestValidator.udpateRewardQuantity,
	requestController.udpateRewardQuantity
);

router.patch(
	'/complete',
	verifyAuth,
	uploaders.requestProofUploader,
	requestController.complete
);

module.exports = router;
