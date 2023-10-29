const { HttpError } = require("../helpers");
const { isValidObjectId } = require("mongoose");

const isValidIdBody = (req, res, next) => {
  const { id } = req.body;

  if (!isValidObjectId(id)) {
    next(HttpError(404, "Not valid id"));
  }
  next();
};


module.exports = {
  isValidIdBody,
};
