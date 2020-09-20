const express = require('express');
const requestController = require('../controllers/request');
const requestValidator = require('../validators/request');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.post('/get-requests', verifyAuth, requestController.getRequests);

router.post(
	'/create',
	verifyAuth,
	requestValidator.create,
	requestController.create
);

module.exports = router;
