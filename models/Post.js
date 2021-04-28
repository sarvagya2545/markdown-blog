const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    sanitizedHtml: String
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
