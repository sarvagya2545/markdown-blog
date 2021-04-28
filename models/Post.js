const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    sanitizedHtml: String,
    slug: String
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;
