const { HttpError } = require("../helpers");
const User = require("../models/user");
const { signToken } = require("./jwtService");
const checkPassword = require("./passwordService");

exports.registerUser = async (userData) => {
  const newUser = await User.create({ ...userData });

  newUser.password = undefined;

  const token = signToken(newUser.id);

  return { user: newUser, token };
};

exports.loginUser = async (userData) => {
  const user = await User.findOne({ email: userData.email }).select(
    "+password"
  );

  if (!user) throw HttpError(401);

  const passwordIsValid = await checkPassword(userData.password, user.password);

  if (!passwordIsValid) throw HttpError(401);

  user.password = undefined;

  const token = signToken(user.id);
  await User.findByIdAndUpdate(user.id, { token });

  return { user, token };
};

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw HttpError(409, "User exists..");
};
