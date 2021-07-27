const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Movie = require('./models/movie');

mongoose.connect('mongodb://localhost:27017/Movies-Collector',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true }))


app.get('/addMovie', (req, res) => {
    res.render('addMovie');
})

app.post('/addMovie', async (req, res) => {
    const movie = new Movie(req.body.movie);
    await movie.save();
    res.redirect('/addMovie');
})

app.get('/moviesList', async (req, res) => {
    const movies = await Movie.find({});
    res.render('movieList', {movies});
})

app.all('*', ( req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, ()=> {
    console.log('LISTENING TO PORT 3000')
})