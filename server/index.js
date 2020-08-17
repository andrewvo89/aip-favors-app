const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');

const { DB_USER, DB_PASS } = process.env;
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@aip-favors-app.umokf.mongodb.net/production?retryWrites=true&w=majority`;
//Initialize the body parser for .json
app.use(bodyParser.json()); // application/json
//Set the public folder to server files statically
app.use(express.static(path.join(__dirname, 'public')));
//Set security controls for incoming requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
//Routes
app.use('/auth', authRoutes);
//catch all errors that get passed via next()
app.use((error, req, res, next) => {
  const code = error.code || 500;
  res.status(code).json({
    status: code,
    message: error.message,
    data: error.data
  });
});
//Initialize the mongodb connection, then start listening on port 8080
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    app.listen(8080);
  })
  .catch(error => console.log(error));
