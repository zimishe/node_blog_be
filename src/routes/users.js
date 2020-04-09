const {
  createUser,
  loginUser,
  resetPassword,
  updatePassword,
} = require('../controllers/users');

module.exports = app => {
  app.post('/sign_up', createUser);
  app.post('/login', loginUser);
  app.post('/reset_password', resetPassword);
  app.post('/update_password/:userId', updatePassword);
};
