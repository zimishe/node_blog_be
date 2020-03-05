const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    articleId: {
      type: String,
      required: true,
    },
    author: {
      name: String,
      id: String,
    },
    text: { type: String, required: [true, "can't be blank"] },
  },
  { timestamps: true },
);

module.exports = mongoose.model('comment', CommentSchema);
