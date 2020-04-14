const dotenv = require('dotenv');
const http = require('http');
const io = require('socket.io');
const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');

dotenv.config();
const routes = require('./routes');
const { URL } = require('./_config/db');
const { checkToken } = require('./utils/checkToken');

const port = process.env.PORT || 8000;
const LOGGED_IN_USERS_ROOM = 'logged-in-users';

const app = express();
const server = http.createServer(app);

const wsServer = io(server);
// eslint-disable-next-line no-underscore-dangle
wsServer.engine.generateId = req => req._query.user_id;

wsServer.on('connection', socket => {
  // eslint-disable-next-line no-param-reassign
  socket.join(LOGGED_IN_USERS_ROOM);
  socket.to(LOGGED_IN_USERS_ROOM).send('connected!');
});

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

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  server.listen(port, () => {
    routes(app);
    console.log('Server is live at ', port);
  });
});

module.exports = {
  wsServer,
};
