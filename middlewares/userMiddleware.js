const { controllerWrapper, userValidation, HttpError } = require("../helpers");
const { checkUserExists } = require("../services/userService");

exports.checkRegisterUserData = controllerWrapper(async (req, res, next) => {
  const { error, value } = userValidation.createUserDataValidator(req.body);

  if (error) {
    throw HttpError(400);
  }

  await checkUserExists({ email: value.email });

  req.body = value;

  next();
});

exports.checkLoginUserData = controllerWrapper(async (req, res, next) => {
  const { error } = userValidation.loginUserDataValidator(req.body);

  if (error) {
    throw HttpError(401);
  }

  next();
});
