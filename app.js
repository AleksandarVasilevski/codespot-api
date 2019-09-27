const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
// const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();
const subscribeRouter = require('./routes/subscribe');

mongoose.connect('mongodb+srv://' + process.env.DBUSER + ':' + process.env.DBPASS + process.env.DBHOST, 
	{useNewUrlParser: true});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.header('Access-Contol-Allow-Origin', '*');
	res.header('Access-Contol-Allow-Headers',
	 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	 if(req.method === 'OPTIONS'){
		 res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		 return res.status(200).json({});
	 }
	 next();
});

app.use('/subscribe', subscribeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
