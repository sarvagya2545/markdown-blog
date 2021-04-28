const express = require('express');
const app = express();
const mongoose = require('mongoose');
// mardown and highlighting config
const hljs = require('highlight.js');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
    
        return ''; // use external default escaping
      }
});

// DOM purify config
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const DOMPurify = createDOMPurify(new JSDOM().window);

// express middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const Post = require('./models/Post');

// mongoose setup
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(conn => console.log(`MongoDB Connected...`))
    .catch(err => console.log(`Err: ${err}`));

// routes
app.get('/', async (req,res) => {
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
                route: '/new'
            }
        ]
        res.render('home', { posts: formattedPosts, links, title: 'Blog posts' });
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});

app.get('/new', async (req,res) => {
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
});

app.post('/new', async(req,res) => {
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
});

app.get('/post/:id', async (req,res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        const result = md.render(post.content);
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
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));