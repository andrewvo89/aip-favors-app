const path = require('path');
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

const { DB_USER, DB_PASS } = process.env;
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@aip-favors-app.umokf.mongodb.net/production?retryWrites=true&w=majority`;
//Initialize the body parser for .json
app.use(bodyParser.json()); // application/json
//Set the public folder to server files statically
app.use(express.static(path.join(__dirname, 'public')));
//Set security controls for incoming requests
app.use(accessControl);
//Initialize the cookie parser to send jwt web tokens back to the client
app.use(cookieParser());
//Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
//catch all errors that get passed via next()
app.use(errorHandler);
//Initialize the mongodb connection, then start listening on port 8080
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(result => {
    app.listen(8080);
  })
  .catch(error => console.log(error));
