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

router.route('/:id')
    .get(postsController.getPostById)
;


module.exports = router;