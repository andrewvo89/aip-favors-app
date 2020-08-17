const express = require('express');

const User = require('../models/user');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

const router = express.Router();



router.put('/signup', authValidator.signup, authController.signup);

router.post('/login', authValidator.signup, authController.login);

module.exports = router;