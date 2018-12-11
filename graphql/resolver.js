const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

exports.hello = () => {
  return 'Hello world!';
};

exports.createUser = async ({ userInput }, req) => {
  const { email, name, password } = userInput;
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ message: 'Invalid email.' });
  }
  if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
      errors.push({ message: 'Invalid password' });
  }
  if (validator.isEmpty(name)) {
      errors.push({ message: 'Name cannot be empty' });
  }
  console.log(errors);
  if (errors.length > 0) {
      const error = new Error('Validation failure');
      error.data = errors;
      error.code = 422;
      throw error;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User already exists');
    throw error;
  }
  const hashedPw = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    name,
    password: hashedPw
  });
  const createdUser = await user.save();
  return { ...createdUser._doc, _id: createdUser._id.toString() };
};
