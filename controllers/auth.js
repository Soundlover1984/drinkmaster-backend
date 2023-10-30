const { controllerWrapper } = require("../helpers");
const {
  registerUser,
  loginUser,
  logOutUser,
} = require("../services/userService");

const signup = controllerWrapper(async (req, res) => {
  const { user } = await registerUser(req.body);

  res.status(201).json({
    message: "Created",
    user,
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

const singout = controllerWrapper(async (req, res) => {
  await logOutUser(req.user.id);

  res.sendStatus(204);
});

module.exports = {
  signup,
  singin,
  singout,
};
