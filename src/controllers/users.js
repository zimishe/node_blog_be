const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const parseValidationErrors = require('../utils/validation');

const createUser = async (req, res) => {
  const db = mongoose.connection;
  const { password, email, ...rest } = req.body;

  const userData = {
    ...rest,
    email,
    password: bcrypt.hashSync(password, 5),
  };

  const user = new User(userData);

  const userExists = await db.collection('users').findOne({
    email,
  });

  userExists
    ? res.status(422).send({ email: 'already exists' })
    : user.save(err => {
      if (err) {
        const { errors } = err;
        const errorsArray = parseValidationErrors(errors);
        res.status(422).send(errorsArray);
      } else {
        res.status(200).send('user registration succeed');
      }
    });
};

const loginUser = async (req, res) => {
  let dbPasswordHash = null;
  const db = mongoose.connection;
  const { password, email } = req.body;

  const userEntity = await db.collection('users').findOne({
    email,
  });

  if (userEntity) {
    dbPasswordHash = userEntity.password;
  }

  const match = await bcrypt.compare(password, dbPasswordHash);

  if (match) {
    res.status(200).send('hey there');
  } else {
    res.status(401).send('sorry');
  }
};

module.exports = {
  createUser,
  loginUser,
};
