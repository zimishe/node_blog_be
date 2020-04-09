module.exports = {
  URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-fqowz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};
