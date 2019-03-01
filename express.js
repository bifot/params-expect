const createSchema = require('../src');

module.exports = (model) => {
  const expect = createSchema(model);

  return async (req, res, next) => {
    req.validationErrors = expect(req.body);

    next();
  };
};