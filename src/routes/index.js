// const addRecipeRoute = require("./add-recipe");
// const editRecipeRoute = require("./edit-recipe");
const usersRoute = require('./users');
// const getRecipeHistoryRoute = require("./get-recipe-history");

module.exports = (app, db) => {
  //   addRecipeRoute(app, db);
  //   editRecipeRoute(app, db);
  usersRoute(app, db);
  //   getRecipeHistoryRoute(app, db);
};
