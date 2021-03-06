const toArray = (value) => Array.isArray(value)
  ? value
  : [value];

module.exports = (model) => {
  const schema = {};

  Object.entries(model).forEach(([key, value]) => {
    switch (typeof value) {
      case 'function':
        schema[key] = {
          types: [typeof value()],
          required: true,
        };

        break;
      case 'object':
        schema[key] = {
          types: toArray(value.type).map(type => typeof type()),
          required: value.validate ? true : value.required,
          validate: value.validate,
          transform: value.transform,
        };

        break;
    }
  });

  return (body) => {
    const errors = [];

    Object.entries(schema).forEach(([key, { types, required, validate, transform }]) => {
      const value = transform ? transform(body[key]) : body[key];
      const valueType = typeof value;
      const isInvalidType = types.every(type => valueType !== type);

      // reassign value in object if changed
      if (value !== body[key]) {
        body[key] = value;
      }

      if (!required && !value) {
        return;
      }

      if (!value) {
        errors.push(`${key} is required`);

        return;
      }

      if (isInvalidType) {
        errors.push(`${key} is expected to be a ${types.join('/')}`);

        return;
      }

      if (validate && !validate(value)) {
        errors.push(`${key} is invalid`);
      }
    });

    return errors;
  };
};
