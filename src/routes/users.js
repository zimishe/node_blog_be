const bcrypt = require("bcrypt");
const { dbName } = require("../_config/db");
const User = require("../models/User");
const parseValidationErrors = require("../utils/validation");

module.exports = (app, db) => {
  app.post("/user", async (req, res, next) => {
    const { password, email, ...rest } = req.body;

    console.log("req", req.body);

    const userData = {
      ...rest,
      email,
      password: bcrypt.hashSync(password, 5)
    };

    const user = new User(userData);

    const userExists = await db.collection("users").findOne({
      email
    });

    userExists
      ? res.status(422).send({ email: "already exists" })
      : user.save(err => {
          if (err) {
            const { errors } = err;
            const errorsArray = parseValidationErrors(errors);
            res.status(422).send(errorsArray);
          } else {
            res.status(200).send("user registration succeed");
          }
        });
  });
};
