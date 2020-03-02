const usersRoute = require('./users');
const articlesRoute = require('./articles');

module.exports = app => {
  usersRoute(app);
  articlesRoute(app);
};
