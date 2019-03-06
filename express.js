const createSchema = require('./src');

module.exports = (model) => {
  const expect = createSchema(model);

  return (req, res, next) => {
    req.validationErrors = expect(req.params);

    return next();
  };
};
