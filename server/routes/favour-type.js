const express = require('express');
const router = express.Router();

const favourTypeController = require('../controllers/favour-type');
const verifyAuth = require('../middleware/verify-auth');

router.get('/get-all', verifyAuth, favourTypeController.getAll);

module.exports = router;
