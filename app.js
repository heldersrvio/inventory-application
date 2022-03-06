require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const createError = require('http-errors');
const path = require('path');
const mongoose = require('mongoose');

const brandsRouter = require('./routes/brands');
const categoriesRouter = require('./routes/categories');
const headphonesRouter = require('./routes/headphones');

const app = express();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/headphones', headphonesRouter);

app.use((req, res, next) => {
	next(createError(404));
});

app.use((err, req, res, _next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
