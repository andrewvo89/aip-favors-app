//https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/12167298#overview

let io;
module.exports = {
	init: (httpServer) => {
		io = require('socket.io')(httpServer);
		return io;
	},
	get: () => {
		if (!io) {
			throw new Error('Socket.io not initialized!');
		}
		return io;
	}
};
