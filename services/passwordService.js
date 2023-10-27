const bcrypt = require("bcrypt");

const checkPassword = (candidate, passwordHash) =>
  bcrypt.compare(candidate, passwordHash);

module.exports = checkPassword;
