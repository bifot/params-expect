module.exports = (req, res, next) => {
  if (req.validationErrors && req.validationErrors.length) {
    res.writeHead(400);
    res.json({
      error: `Bad data: ${req.validationErrors.join(', ')}`,
    });

    return;
  }

  return next();
};
