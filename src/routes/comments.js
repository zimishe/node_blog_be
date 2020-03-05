const { createArticleComment, getArticleComments } = require('../controllers/comments');

module.exports = app => {
  app.post('/comments', createArticleComment);
  app.get('/articles/:articleId/comments', getArticleComments);
};
