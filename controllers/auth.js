const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failure');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email,
        name,
        password: hashedPw
      });
      return user.save();
    })
    .then(result =>
      res.status(201).json({ message: 'User created', userId: result._id })
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('Authentication failure');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      if (!result) {
        const error = new Error('Authentication failure');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        'thisisreallyasupersecret',
        { expiresIn: '1h' }
      );
      res
        .status(200)
        .json({
          message: 'Logged in',
          token,
          userId: loadedUser._id.toString()
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
