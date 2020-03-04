const { getSignedUrl } = require('../controllers/s3');

module.exports = app => {
  app.get('/sign-s3', getSignedUrl);
};
