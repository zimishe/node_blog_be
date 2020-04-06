const fs = require('fs');
const uuidv1 = require('uuid/v1');
const pug = require('pug');
const pdf = require('html-pdf');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const parseValidationErrors = require('../utils/validation');

const articleCompiler = pug.compileFile(`${process.cwd()}/src/reports/article.pug`);

const createArticle = async (req, res) => {
  const articleData = {
    ...req.body,
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

const getArticle = async (req, res) => {
  try {
    const article = await Article.find(req.params);

    if (article) {
      res.send(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (error) {
    res.status(422).send({ error });
  }
};

const getArticleReport = async (req, res) => {
  let htmlArgs;
  try {
    const article = await Article.findOne(req.params);

    if (article) {
      htmlArgs = article;
      const [user, comments] = await Promise.all([
        User.findOne({ id: article.author.id }),
        Comment.find({ articleId: article.id }),
      ]);

      if (user) {
        htmlArgs.name = user.name;
      }
      if (comments) {
        htmlArgs.comments = comments;
      }

      const html = articleCompiler(htmlArgs);

      pdf.create(html).toStream((error, stream) => {
        if (error) {
          res.status(422).send({ error });
        }
        const relativePath = `${process.cwd()}/public/reports/${article.title}.pdf`;

        stream.pipe(fs.createWriteStream(relativePath));
        res.status(200).send(`reports/${article.title}.pdf`);
      });
    } else {
      res.status(404).send('Article not found');
    }
  } catch (error) {
    res.status(422).send({ error });
  }
};

const getArticlePaymentIntentKey = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 50,
      currency: 'usd',
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: 'accept_a_payment' },
    });

    // eslint-disable-next-line camelcase
    const { client_secret } = paymentIntent;

    res.status(200).send({ client_secret });
  } catch (error) {
    res.status(422).send({ error });
  }
};

module.exports = {
  createArticle,
  editArticle,
  getArticles,
  getArticle,
  getArticleReport,
  getArticlePaymentIntentKey,
};
