const { createArticleComment, getArticleComments } = require('../controllers/comments');

module.exports = app => {
  app.post('/articles/:articleId/comments', createArticleComment);
  app.get('/articles/:articleId/comments', getArticleComments);
};
