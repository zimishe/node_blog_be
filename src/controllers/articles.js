const uuidv1 = require('uuid/v1');
const Article = require('../models/Article');
const parseValidationErrors = require('../utils/validation');

const createArticle = async (req, res) => {
  const { title, text } = req.body;
  const articleData = {
    title,
    text,
    id: uuidv1(),
  };

  const article = new Article(articleData);

  article.save(err => {
    if (err) {
      const { errors } = err;
      const errorsArray = parseValidationErrors(errors);
      res.status(422).send(errorsArray);
    } else {
      res.status(200).send('article saved successfully');
    }
  });
};

const editArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Article.findOneAndUpdate({ id }, { ...req.body }, { new: true });

  res.send(article);
};

const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.send(articles);
  } catch (error) {
    res.status(422).send({ error });
  }
};

module.exports = {
  createArticle,
  editArticle,
  getArticles,
};
