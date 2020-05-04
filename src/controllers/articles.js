// const fs = require('fs');
const uuidv1 = require('uuid/v1');
const axios = require('axios');
const aws = require('aws-sdk');
const pug = require('pug');
const pdfH = require('html-pdf');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');
const parseValidationErrors = require('../utils/validation');

aws.config.region = 'us-east-1';

const S3_BUCKET = 'node-lock-test';
const REPORTS_FOLDER = 'public/reports';

const articleCompiler = pug.compileFile(`${process.cwd()}/src/reports/article.pug`);

let MAGIC_COUNTER = 0;

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
    const article = await Article.findOne(req.params);

    if (article) {
      res.send(article);
    } else {
      res.status(404).send('Article not found');
    }
  } catch (error) {
    res.status(422).send({ error });
  }
};

const searchArticles = async (req, res) => {
  const { query = {} } = req;

  try {
    const articles = await Article.find({ $text: { $search: query.text } });

    if (articles) {
      res.send(articles);
    } else {
      res.status(404).send('Articles not found');
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

      try {
        const generatedBy = (MAGIC_COUNTER % 2) === 0 ? 'regular be' : 'lambda';

        if ((MAGIC_COUNTER % 2) === 0) {
          const html = articleCompiler(htmlArgs);

          pdfH.create(html)
            .toStream(async (error, stream) => {
              const s3 = new aws.S3();

              const s3Params = {
                Bucket: S3_BUCKET,
                Key: `${REPORTS_FOLDER}/${htmlArgs.title}-${new Date()}.pdf`,
                Expires: 360,
                ContentType: 'application/pdf',
                ACL: 'public-read',
                Body: stream,
              };

              s3.upload(s3Params, (error, data) => {
                console.log('da', data);
                res.status(200).send({ generatedBy, url: data.Location });
              });
            });
        } else {
          const response = await axios
            .post(
              'https://adoo4cje19.execute-api.us-east-1.amazonaws.com/default/node-test/reports',
              {
                title: article.title,
                text: article.text,
                coverImageUrl: article.coverImageUrl,
                comments,
                name: user.name,
              },
            );

          res.status(200).send({ generatedBy, url: response.data.Location });
        }


        MAGIC_COUNTER += 1;

        // res.status(200).send({ generatedBy, url: (MAGIC_COUNTER % 2) === 0 ? response.data.Location : response.Location });
      } catch (e) {
        console.log('err', e);
      }
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
  searchArticles,
};
