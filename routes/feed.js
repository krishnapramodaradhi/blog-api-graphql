const express = require('express');
const { body } = require('express-validator/check');

const feedCtrl = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedCtrl.getPosts);

router.post(
  '/post',
  isAuth,
  [
    (body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 }))
  ],
  feedCtrl.createPost
);

router.get('/post/:id', isAuth, feedCtrl.getPost);

router.put(
  '/post/:id',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedCtrl.updatePost
);

router.delete('/post/:id', isAuth, feedCtrl.deletePost);

module.exports = router;
