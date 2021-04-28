const Post = require('../models/Post');
const DOMPurify = require('../config/DOMpurify');
const md = require('../config/markdownconfig');

module.exports = {
    getPosts: async (req,res) => {
        try {
            const posts = await Post.find({});
            console.log(posts);
    
            let formattedPosts = posts.map(post => {
                return {
                    title: post.title,
                    description: post.description,
                    id: post._id
                }
            })
    
            const links = [
                {
                    name: 'Add post',
                    route: '/posts/new'
                }
            ]
            res.render('home', { posts: formattedPosts, links, title: 'Blog posts' });
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    new: (req,res) => {
        try {
            const links = [
                {
                    name: 'Go back (discard changes)',
                    route: '/'
                }
            ]
            res.render('new', { links });
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    addPost: async (req,res) => {
        try {        
            const { title, content, description } = req.body;
            const sanitizedHtml = DOMPurify.sanitize(md.render(content));
    
            const newPost = new Post({
                title,
                content,
                description,
                sanitizedHtml
            });
    
            newPost.save()
                .then(result => {
                    console.log(result);
                    res.redirect('/');
                })
                .catch(err => {
                    console.log(err);
                });
    
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    getPostById: async (req,res) => {
        try {
            const id = req.params.id;
            const post = await Post.findById(id);
            const links = [
                {
                    name: 'Home',
                    route: '/'
                }
            ];
            res.render('post', { links, post });
    
        } catch (error) {
            console.log(error)
            res.send('No post found / link broken');
        }
    }
}