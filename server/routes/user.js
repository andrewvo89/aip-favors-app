const express = require('express');
const userController = require('../controllers/user');
const userValidator = require('../validators/user');
const router = express.Router();
const verifyAuth = require('../middleware/verify-auth');

router.patch('/update', verifyAuth, userValidator.update, userController.update);
router.patch('/update-password', verifyAuth, userValidator.updatePassword, userController.updatePassword);

module.exports = router;