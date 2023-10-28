const { HttpError } = require("../helpers");

const validateQuery = (schema) => {
  const foo = (req, res, next) => {
    const { error } = schema.validate(
      !Object.keys(req.body).length ? req.query : req.body
    );
    if (error) throw next(HttpError(400, error.message));
    next();
  };
  return foo;
};

module.exports = validateQuery;