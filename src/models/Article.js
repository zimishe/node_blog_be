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
    },
    text: { type: String, required: [true, "can't be blank"] },
  },
  { timestamps: true },
);

module.exports = mongoose.model('article', ArticleSchema);
