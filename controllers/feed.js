const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
  Post.find()
    .exec()
    .then(posts => {
      res.status(200).json({
        posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  console.log(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failure');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No file provided');
    error.statusCode = 422;
    throw error;
  }
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path,
    creator: { name: 'Pramod' }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res) => {
  Post.findById({ _id: req.params.id })
    .exec()
    .then(post => {
      if (!post) {
        const error = new Error(
          `Post not found for the given id ${req.params.id}`
        );
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
