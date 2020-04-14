const bcrypt = require('bcrypt');
const uuidv1 = require('uuid/v1');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const parseValidationErrors = require('../utils/validation');
const { sendSignupEmail, sendResetPasswordEmail } = require('../utils/emails');
const { generateResetPasswordToken } = require('../utils/resetPasswordToken');

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://fast-scrubland-94933.herokuapp.com'
  : 'http://localhost:3000';

const createUser = async (req, res) => {
  const { password, email, ...rest } = req.body;

  const userData = {
    ...rest,
    email,
    password: bcrypt.hashSync(password, 5),
    id: uuidv1(),
  };

  const user = new User(userData);
  const userExists = await User.findOne({
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
        res.status(200).send({ message: 'user registration succeed' });
        await sendSignupEmail(user);
      }
    });
};

const loginUser = async (req, res) => {
  let dbPasswordHash = null;
  const { password, email } = req.body;

  const userEntity = await User.findOne({
    email,
  });

  if (userEntity) {
    dbPasswordHash = userEntity.password;
  } else {
    res.status(404).send({ message: 'user not found' });
  }

  const match = await bcrypt.compare(password, dbPasswordHash);

  if (match) {
    jwt.sign({ email, password }, process.env.PRIVATE_KEY, (err, token) => {
      if (err) {
        res.status(401).send('Wrong password');
      } else {
        res.status(200).send({ id: userEntity.id, name: userEntity.name, token });
      }
    });
  } else {
    res.status(401).send('sorry');
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  const userEntity = await User.findOne({
    email,
  });

  if (!userEntity) {
    res.status(404).send({ message: 'user not found' });
  }

  try {
    const token = generateResetPasswordToken(userEntity);
    const url = `${BASE_URL}/password/update/${userEntity.id}?token=${token}`;

    await sendResetPasswordEmail(userEntity, url);
    res.status(200).send({ message: 'Password reset letter was sent' });
  } catch (err) {
    res.status(500).send('Error sending email');
  }
};

const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { password, passwordConfirmation } = req.body;

  const userEntity = await User.findOne({
    id: userId,
  });

  if (!userEntity) {
    res.status(404).send({ message: 'user not found' });
  }

  if (password !== passwordConfirmation) {
    res.status(500).send({ message: 'passwords doesn\'t match' });
  }

  const secret = `${userEntity.password}-${userEntity.createdAt}`;

  try {
    const payload = jwt.verify(req.query.token, secret);

    if (payload.userId === userEntity.id && password) {
      try {
        const newPasswordHash = bcrypt.hashSync(password, 5);
        await User.findOneAndUpdate({ id: userId }, { password: newPasswordHash });
        res.status(202).send('Password updated');
      } catch (err) {
        res.status(500).send(err);
      }
    }
  } catch (error) {
    res.status(500).send('token is invalid or expired');
  }
};

module.exports = {
  createUser,
  loginUser,
  resetPassword,
  updatePassword,
};
