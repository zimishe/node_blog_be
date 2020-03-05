const {
  createArticle, editArticle, getArticles, getArticle,
} = require('../controllers/articles');

module.exports = app => {
  app.post('/articles', createArticle);
  app.put('/articles/:id', editArticle);
  app.get('/articles', getArticles);
  app.get('/articles/:id', getArticle);
};
