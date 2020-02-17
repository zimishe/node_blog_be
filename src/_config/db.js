const dbName = 'node_blog';
const dbUser = 'admin';
const dbPassword = 'admin_123';

module.exports = {
  dbName,
  URL: `mongodb+srv://${dbUser}:${dbPassword}@cluster0-fqowz.mongodb.net/${dbName}?retryWrites=true&w=majority`,
};
