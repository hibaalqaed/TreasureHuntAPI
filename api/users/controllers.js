const bcrypt = require("bcrypt");
const { User } = require("../../db/models");
const jwt = require("jsonwebtoken");
////
exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);

    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + 1900000,
    };

    const token = jwt.sign(JSON.stringify(payload), "secretkey");
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

///////
exports.signin = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    exp: Date.now() + 1900000,
  };
  const token = jwt.sign(JSON.stringify(payload), "secretkey");
  res.json({ token });
};
