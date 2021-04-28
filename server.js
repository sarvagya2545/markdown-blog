const express = require('express');
const app = express();
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const Post = require('./models/Post');

mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(conn => console.log(`MongoDB Connected...`))
    .catch(err => console.log(`Err: ${err}`));

app.get('/', async (req,res) => {
    try {
        const posts = await Post.find({});
        console.log(posts);

        let formattedPosts = posts.map(post => {

            const result = md.render(post.content);
            return {
                title: post.title,
                description: post.description,
                content: result
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
        const newPost = new Post({
            title,
            content,
            description
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
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));