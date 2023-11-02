const { controllerWrapper } = require("../helpers");
const User = require("../models/user");
const { updateUser, subscribeUser } = require("../services/userService");

const current = controllerWrapper(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "Success",
    user,
  });
});

const update = controllerWrapper(async (req, res) => {
  const result = await updateUser(req.body, req.user, req.file);

  res.status(200).json({
    message: "Success",
    result,
  });
});

const subscribe = controllerWrapper(async (req, res) => {
  const result = await subscribeUser(req.user);

  res.status(200).json({
    message: "Success",
    result,
  });
});

const theme = controllerWrapper(async (req, res) => {
  const user = req.user;
  const currentTheme = req.body.theme;
  console.log(currentTheme);
  const subscribeUser = await User.findByIdAndUpdate(user.id, {
    theme: currentTheme,
  });
  console.log(currentTheme);
  res.status(200).json({
    message: "Success",
    subscribeUser,
  });
});

module.exports = {
  current,
  update,
  subscribe,
  theme,
};
