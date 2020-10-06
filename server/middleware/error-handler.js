const { SILENT } = require('../utils/constants');

module.exports = async (error, req, res, _next) => {
	console.log(error);
	console.log(new Date(), error.status, error.message);
	console.log(error.stack);
	res.status(error.status || 500).json({
		message: error.message, //error.response.data.message
		feedback: error.feedback || SILENT //error.response.data.feedback
	});
};
