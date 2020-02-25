const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const { url } = req;
  console.log('env', process.env.PRIVATE_KEY);

  if (url === '/login' || url === '/sign_up') {
    next();
  } else if (!authorization) {
    res.status(403).send({ message: 'Auth token is missing' });
  } else {
    const [, token] = authorization.split(' ');
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = {
  checkToken,
};
