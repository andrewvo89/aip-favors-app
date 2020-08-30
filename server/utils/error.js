module.exports.getError = (status, message, feedback) => {
	const error = new Error(message); //response.data.message
	error.status = status; //response.data.
	error.feedback = feedback;
	return error;
};
