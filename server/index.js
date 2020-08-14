const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { DB_USER, DB_PASS } = process.env;
const DEFAULT_COLLECTION = '';
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.sl1au.mongodb.net/${DEFAULT_COLLECTION}?retryWrites=true&w=majority`;

app.use(bodyParser.json()); // application/json
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(8080);
  })
  .catch(error => console.log(error));
