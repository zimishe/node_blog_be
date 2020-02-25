const { createUser, loginUser, getUsers } = require('../controllers/users');

module.exports = app => {
  app.post('/sign_up', createUser);
  app.get('/login', loginUser);
  app.get('/users', getUsers);
};
