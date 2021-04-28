const Post = require('../models/Post');
const DOMPurify = require('../config/DOMpurify');
const md = require('../config/markdownconfig');
const _ = require('lodash');

module.exports = {
    getPosts: async (req,res) => {
        try {
            const posts = await Post.find({});
    
            const links = [
                {
                    name: 'Add post',
                    route: '/posts/new'
                }
            ]
            res.render('home', { posts, links, title: 'Blog posts' });
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
            res.render('new', { links, update: false, title: false, description: false, markdown: false });
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    addPost: async (req,res) => {
        try {        
            const { title, content, description } = req.body;
            const sanitizedHtml = DOMPurify.sanitize(md.render(content));
            let slug = _.kebabCase(title);

            const duplicates = await Post.find({ slug });
            if(duplicates.length) slug = `${slug}-${duplicates.length}`;

            const newPost = new Post({
                title,
                content,
                description,
                sanitizedHtml,
                slug
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
    getPostBySlug: async (req,res) => {
        try {
            const slug = req.params.slug;
            const posts = await Post.find({ slug });
            if(!posts.length) res.redirect('/404');
            const links = [
                {
                    name: 'Home',
                    route: '/'
                }
            ];
            res.render('post', { links, post: posts[0] });
        } catch (error) {
            console.log(error)
            res.send('No post found / link broken');
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
    },
    updatePostPage: async (req,res) => {
        try {
            const slug = req.params.slug;
            const post = await Post.findOne({ slug });

            const links = [
                {
                    name: 'Discard changes',
                    route: `/${slug}`
                }
            ]
            res.render('new', { links, post, update: true });
        } catch (error) {
            console.log(error)
            res.send(error);
        }
    },
    updatePost: async (req,res) => {
        try {
            console.log(req.body);
            const { slug } = req.params;
            const { title, description, content } = req.body;

            await Post.findOneAndUpdate({ slug }, { 
                title, 
                description, 
                content, 
                sanitizedHtml: DOMPurify.sanitize(md.render(content)) 
            });

            res.redirect(`/posts/${slug}`);

        } catch (error) {
            console.log(error)
            res.send(error);
        }
    }
}