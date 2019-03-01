const createSchema = require('../src');

module.exports = (model) => {
  const expect = createSchema(model);

  return async (ctx, next) => {
    const errors = expect({
      ...ctx.params,
      ...ctx.query,
      ...ctx.body,
    });

    if (!errors.length) {
      await next();
    } else {
      ctx.throw(400, `Bad request data: ${errors.join(', ')}`);
    }
  };
};
