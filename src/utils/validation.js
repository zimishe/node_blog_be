const parseValidationErrors = errors => Object.keys(errors).map(key => ({
  [key]: errors[key].message,
}));

module.exports = parseValidationErrors;
