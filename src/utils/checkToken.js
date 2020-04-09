const jwt = require('jsonwebtoken');

const WHITELISTED_URLS = ['/login', '/sign_up', '/sign-s3', '/reports', '/reset_password', '/update_password'];

const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const { url } = req;

  if (WHITELISTED_URLS.some(item => url.startsWith(item))) {
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
