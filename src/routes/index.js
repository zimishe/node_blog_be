const usersRoute = require('./users');
const articlesRoute = require('./articles');
const s3Route = require('./s3');

module.exports = app => {
  usersRoute(app);
  articlesRoute(app);
  s3Route(app);
};
