const { param } = require('express-validator');

module.exports.delete = [
	param('notificationId').not().isEmpty().withMessage('Request is invalid')
];
