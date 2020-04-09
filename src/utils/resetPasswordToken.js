const jwt = require('jsonwebtoken');

const generateResetPasswordToken = ({
  password: passwordHash,
  id: userId,
  createdAt,
}) => {
  const secret = `${passwordHash}-${createdAt}`;
  const token = jwt.sign({ userId }, secret, {
    expiresIn: 3600,
  });

  return token;
};

module.exports = {
  generateResetPasswordToken,
};
