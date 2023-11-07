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
  const { name, avatar } = await updateUser(req.body, req.user, req.file);

  res.status(200).json({
    message: "Success",
    name,
    avatar,
  });
});

const subscribe = controllerWrapper(async (req, res) => {
  const { subscribe } = await subscribeUser(req.user);

  res.status(200).json({
    message: "Subscribe successfully",
    subscribe,
  });
});

const theme = controllerWrapper(async (req, res) => {
  const user = req.user;
  const currentTheme = req.body.theme;
  const { theme } = await User.findByIdAndUpdate(user.id, {
    theme: currentTheme,
  });

  res.status(200).json({
    message: "Success",
    theme: theme,
  });
});

module.exports = {
  current,
  update,
  subscribe,
  theme,
};
