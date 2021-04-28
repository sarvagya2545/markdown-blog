const express = require('express');
const router = express.Router();
const postsController = require('../controller/posts');

router.route('/')
    .get(postsController.getPosts)
;

router.route('/new')
    .get(postsController.new)
    .post(postsController.addPost)
;

router.route('/:slug/update')
    .get(postsController.updatePostPage)
    .post(postsController.updatePost)
;

router.route('/:slug')
    .get(postsController.getPostBySlug)
;


module.exports = router;