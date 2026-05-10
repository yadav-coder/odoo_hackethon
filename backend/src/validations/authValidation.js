const registerValidation = {
  email: { required: true, isEmail: true },
  password: { required: true, minLength: 6 }
};

const loginValidation = {
  email: { required: true, isEmail: true },
  password: { required: true }
};

module.exports = {
  registerValidation,
  loginValidation
};

