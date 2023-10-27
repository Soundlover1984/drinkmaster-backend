const { controllerWrapper } = require("../helpers");
const { registerUser, loginUser } = require("../services/userService");

const signup = controllerWrapper(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    message: "Created",
    user,
    token,
  });
});

const singin = controllerWrapper(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  res.status(200).json({
    message: "Success",
    user,
    token,
  });
});

module.exports = {
  signup,
  singin,
};
