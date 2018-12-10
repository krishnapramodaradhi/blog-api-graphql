const express = require('express');
const { body } = require('express-validator/check');

const feedCtrl = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedCtrl.getPosts);

router.post(
  '/post',
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedCtrl.createPost
);

router.get('/post/:id', feedCtrl.getPost);

router.put('/post/:id', [
  body('title')
    .trim()
    .isLength({ min: 5 }),
  body('content')
    .trim()
    .isLength({ min: 5 })
], feedCtrl.updatePost);

router.delete('/post/:id');

module.exports = router;
