const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const parseValidationErrors = require('../utils/validation');
const { sendEmail } = require('../utils/emails');

const createUser = async (req, res) => {
  const db = mongoose.connection;
  const { password, email, ...rest } = req.body;

  const userData = {
    ...rest,
    email,
    password: bcrypt.hashSync(password, 5),
    id: uuidv1(),
  };

  const user = new User(userData);

  // TODO: get rid of db. usage here
  const userExists = await db.collection('users').findOne({
    email,
  });

  userExists
    ? res.status(422).send({ email: 'already exists' })
    : user.save(async err => {
      if (err) {
        const { errors } = err;
        const errorsArray = parseValidationErrors(errors);
        res.status(422).send(errorsArray);
      } else {
        res.status(200).send('user registration succeed');
        await sendEmail(user);
      }
    });
};

const loginUser = async (req, res) => {
  let dbPasswordHash = null;
  const db = mongoose.connection;
  const { password, email } = req.body;

  // TODO: get rid of db. usage here
  const userEntity = await db.collection('users').findOne({
    email,
  });

  if (userEntity) {
    dbPasswordHash = userEntity.password;
  }

  const match = await bcrypt.compare(password, dbPasswordHash);

  if (match) {
    jwt.sign({ email, password }, process.env.PRIVATE_KEY, (err, token) => {
      if (err) {
        res.status(401).send('sorry');
      } else {
        res.status(200).send({ message: 'logged in successfully', token });
      }
    });
  } else {
    res.status(401).send('sorry');
  }
};

module.exports = {
  createUser,
  loginUser,
};
