module.exports = (model) => {
  const schema = {};

  Object.entries(model).forEach(([key, value]) => {
    switch (typeof value) {
      case 'function':
        schema[key] = {
          type: typeof value(),
          required: true,
        };

        break;
      case 'object':
        schema[key] = {
          type: typeof value.type(),
          required: value.validate ? true : value.required,
          validate: value.validate,
        };

        break;
    }
  });

  return (body) => {
    const errors = [];

    Object.entries(schema).forEach(([key, { type, required, validate }]) => {
      const value = body[key];

      if (!required && !value) {
        return;
      }

      if (!value) {
        errors.push(`${key} is required`);
      }

      if (typeof value !== type) {
        errors.push(`${key} is expected to be a ${type}`);
      }

      if (validate && !validate(value)) {
        errors.push(`${key} is invalid`);
      }
    });

    return errors;
  };
};
