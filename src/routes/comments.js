const { createComment } = require('../controllers/comments');

module.exports = app => {
  app.post('/comments', createComment);
};
