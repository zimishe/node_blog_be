const uuidv1 = require('uuid/v1');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Article = require('../models/Article');
const parseValidationErrors = require('../utils/validation');

const createArticleComment = async (req, res) => {
  const { author = {} } = req.body;
  const { articleId } = req.params;

  const [user, article] = await Promise.all([
    User.findOne({ id: author.id }),
    Article.findOne({ id: articleId }),
  ]);

  if (!user) {
    res.status(404).send('User not found');
  } else if (!article) {
    res.status(404).send('Article not found');
  } else {
    const commentData = {
      ...req.body,
      articleId,
      author: {
        id: user.id,
        name: user.name,
      },
      id: uuidv1(),
    };
    const comment = new Comment(commentData);

    comment.save(err => {
      if (err) {
        const { errors } = err;
        const errorsArray = parseValidationErrors(errors);
        res.status(422).send(errorsArray);
      } else {
        res.status(200).send('comment saved successfully');
      }
    });
  }
};

const getArticleComments = async (req, res) => {
  try {
    const { page = 1, per_page = 10 } = req.body;

    const comments = await Comment
      .find({ ...req.params, ...req.query })
      // eslint-disable-next-line camelcase
      .skip(parseInt(page - 1, 10) * per_page)
      .limit(parseInt(per_page, 10));
    res.send(comments);
  } catch (error) {
    res.status(422).send({ error });
  }
};

module.exports = {
  createArticleComment,
  getArticleComments,
};
