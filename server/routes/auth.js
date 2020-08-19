const express = require('express');
const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');
const router = express.Router();

router.post('/verify', authController.verify);
router.put('/signup', authValidator.signup, authController.signup);
router.post('/login', authValidator.login, authController.login);
router.post('/logout', authValidator.logout, authController.logout);

module.exports = router;