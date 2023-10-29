const { HttpError } = require("../helpers");
const { isValidObjectId } = require("mongoose");

const isValidIdBody = (req, res, next) => {
  const { recipeId } = req.body;

  if (!isValidObjectId(recipeId)) {
    next(HttpError(404, "Not valid id"));
  }
  next();
};


module.exports = {
  isValidIdBody,

};
