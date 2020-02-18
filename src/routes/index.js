// const addRecipeRoute = require("./add-recipe");
// const editRecipeRoute = require("./edit-recipe");
const usersRoute = require('./users');
// const getRecipeHistoryRoute = require("./get-recipe-history");

module.exports = app => {
  //   addRecipeRoute(app, db);
  //   editRecipeRoute(app, db);
  usersRoute(app);
  //   getRecipeHistoryRoute(app, db);
};
