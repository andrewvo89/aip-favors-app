const express = require('express');
const router = express.Router();

const verifyAuth = require('../middleware/verify-auth');
const favourController = require('../controllers/favour');
const favourValidator = require('../validators/favour');
// const uploaders = require('../utils/uploaders');

// TODO: upload handling

router.post(
	'/create',
	verifyAuth,
	favourValidator.create,
	favourController.create
);

router.patch(
	'/repay',
	verifyAuth,
	favourValidator.repay,
	favourController.repay
);

router.delete(
	'/delete',
	verifyAuth,
	favourValidator.delete,
	favourController.delete
);

module.exports = router;
