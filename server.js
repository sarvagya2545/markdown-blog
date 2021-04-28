const express = require('express');
const app = express();
const mongoose = require('mongoose');

const { mongoURI } = require('./config/keys');

// express middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// mongoose setup
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(conn => console.log(`MongoDB Connected...`))
    .catch(err => console.log(`Err: ${err}`));

// routes
app.get('/', (req,res) => res.redirect('/posts'));

app.use('/posts', require('./routes/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));