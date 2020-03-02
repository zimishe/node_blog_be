const { createUser, loginUser } = require('../controllers/users');

module.exports = app => {
  app.post('/sign_up', createUser);
  app.get('/login', loginUser);
};
