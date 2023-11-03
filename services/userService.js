const { HttpError } = require("../helpers");
const User = require("../models/user");
const { signToken } = require("./jwtService");
const checkPassword = require("./passwordService");
const Email = require("../services/emailService");
const crypto = require("crypto");

exports.registerUser = async (userData) => {
  const { email } = userData;
  const userAuth = 0;
  const userFavorite = 0;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // const resetExpires = Date.now() + 10 * 60 * 1000;

  const newUser = await User.create({
    ...userData,
    refreshToken,
    userAuth,
    userFavorite
  });

  newUser.password = undefined;

  return { user: newUser };
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
  await User.findByIdAndUpdate(user.id, { token, refreshToken: null, $inc: { userAuth: 1 } } );

  return { user, token };
};

exports.logOutUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { token: "" });

  return;
};

exports.updateUser = async (userData, user, file) => {
  if (file) {
    user.avatar = file.path;
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};

exports.subscribeUser = async (userData) => {
  const { id } = userData;
  const user = await User.findById(id);

  if (!user) HttpError(404);

  try {
    await new Email(user, "").sendHello();
  } catch (error) {
    HttpError(404);
  }

  const subscribeUser = await User.findByIdAndUpdate(user.id, {
    subscribe: true,
  });

  return subscribeUser;
};

exports.checkUserExists = async (filter) => {
  const userExists = await User.exists(filter);

  if (userExists) throw HttpError(409, "User exists..");
};
