const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    coverImageUrl: {
      type: String,
    },
    text: {
      type: String, required: [true, "can't be blank"], index: true,
    },
    author: {
      name: String,
      id: String,
    },
  },
  { timestamps: true },
  { autoIndex: false },
);

module.exports = mongoose.model('article', ArticleSchema);
