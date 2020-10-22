const { SILENT } = require('../utils/constants');

module.exports = async (error, req, res, _next) => {
	console.log(new Date());
	console.log(error);
	res.status(error.status || 500).json({
		message: error.message, //error.response.data.message
		feedback: error.feedback || SILENT //error.response.data.feedback
	});
};
