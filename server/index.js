// const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const errorHandler = require('./middleware/error-handler');
const accessControl = require('./middleware/access-control');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const storageRoutes = require('./routes/storage');
const favourRoutes = require('./routes/favour');
const favourTypeRoutes = require('./routes/favour-type');
const requestRoutes = require('./routes/request');
const notificationRoutes = require('./routes/notification');

const { DB_USER, DB_PASS, DB_ADDRESS, DB_NAME, PORT } = process.env;
//Initialize the body parser for .json
app.use(bodyParser.json()); // application/json
//Set the public folder to server files statically
// app.use('/storage', express.static(path.join(__dirname, 'storage')));
//Set security controls for incoming requests
app.use(accessControl);
//Initialize the cookie parser to send jwt web tokens back to the client
app.use(cookieParser());
//Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/storage', storageRoutes);
app.use('/favours', favourRoutes);
app.use('/favour-types', favourTypeRoutes);
app.use('/request', requestRoutes);
app.use('/notification', notificationRoutes);
//catch all errors that get passed via next()
app.use(errorHandler);
//Initialize the mongodb connection, then start listening
mongoose
	.connect(`mongodb+srv://${DB_ADDRESS}/${DB_NAME}`, {
		user: DB_USER,
		pass: DB_PASS,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then((_result) => {
		const server = app.listen(PORT || 3000);
		const io = require('./utils/socket').init(server);
		io.on('connection', (_socket) => {
			console.log('Client connected to socket');
		});
	})
	.catch((error) => console.log(error));
