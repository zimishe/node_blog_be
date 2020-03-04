const jwt = require('jsonwebtoken');

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const { url } = req;

  if (url === '/login' || url === '/sign_up' || url.startsWith('/sign-s3')) {
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
