const { createArticle, editArticle, getArticles } = require('../controllers/articles');

module.exports = app => {
  app.post('/articles', createArticle);
  app.put('/articles/:id', editArticle);
  app.get('/articles', getArticles);
};
