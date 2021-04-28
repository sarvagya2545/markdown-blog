const express = require('express');
const app = express();
const mongoose = require('mongoose');

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
        const links = [
            {
                name: 'Add post',
                route: '/new'
            }
        ]
        res.render('home', { posts, links, title: 'Blog posts' });
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
        // const { title, content } = req.body;

        console.log('body', req.body);

    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));