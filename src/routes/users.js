const {
  createUser,
  loginUser,
  resetPassword,
  updatePassword,
} = require('../controllers/users');

module.exports = app => {
  app.post('/sign_up', createUser);
  app.post('/login', loginUser);
  app.post('/password/reset', resetPassword);
  app.post('/password/update/:userId', updatePassword);
};
