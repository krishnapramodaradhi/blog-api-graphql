const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200).json({
        posts,
        totalItems
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

exports.getPost = (req, res, next) => {
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failure');
    error.statusCode = 422;
    throw error;
  }
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked');
    error.statusCode = 422;
    throw error;
  }
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
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = req.body.title;
      post.content = req.body.content;
      post.imageUrl = imageUrl;
      post.save();
    })
    .then(result =>
      res.status(200).json({ message: 'Post updated', post: result })
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .then(post => {
      // check the logged in user
      if (!post) {
        const error = new Error(
          `Post not found for the given id ${req.params.id}`
        );
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(req.params.id);
    })
    .then(result => res.status(200).json({ message: 'Post deleted' }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
