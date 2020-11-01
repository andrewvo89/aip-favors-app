const express = require('express');
const router = express.Router();
const favourTypeController = require('../controllers/favour-type');

router.get('/get-all', favourTypeController.getAll);

module.exports = router;
