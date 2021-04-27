const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    content: String,
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
