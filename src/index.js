const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');

dotenv.config();
require('./controllers/websockets');
const routes = require('./routes');
const { URL } = require('./_config/db');
const { checkToken } = require('./utils/checkToken');

const port = process.env.PORT || 8000;

const app = express();
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  origin: '*',
  methods: 'GET, PUT, POST, DELETE',
  preflightContinue: false,
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(checkToken);

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  app.listen(port, () => {
    routes(app);
    console.log('Server is live at ', port);
  });
});
