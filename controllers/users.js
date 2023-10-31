const { controllerWrapper } = require("../helpers");
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

module.exports = {
  current,
  update,
  subscribe,
};
