const { validateBody, validateUpdateContact } = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const upload = require("./upload");
const userMiddleware = require("./userMiddleware");

module.exports = {
  validateBody,
  validateUpdateContact,
  isValidId,
  authenticate,
  upload,
  userMiddleware,
};
