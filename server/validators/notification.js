const { param } = require('express-validator');

// module.exports.getNotifications = [
// 	body('filter').custom(async (value, { _req }) => {
// 		if (typeof value !== Object) {
// 			throw new Error('Filter is invalid');
// 		}
// 	})
// ];

module.exports.delete = [
	param('notificationId').not().isEmpty().withMessage('Request is invalid')
];
