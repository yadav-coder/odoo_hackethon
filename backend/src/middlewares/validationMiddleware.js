const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    Object.entries(schema).forEach(([field, rules]) => {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === "")) {
        errors.push(`${field} is required`);
      }

      if (rules.minLength && value && String(value).length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (rules.isEmail && value && !/^\S+@\S+\.\S+$/.test(value)) {
        errors.push(`${field} must be a valid email`);
      }

      if (rules.isNumber && value !== undefined && Number.isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
      }
    });

    if (errors.length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    next();
  };
};

module.exports = validate;

