// import required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');

// Load environment variables from .env
dotenv.config()

// Establish connection with mongodb
mongoose.connect(process.env.MONGO_DB);

// Define routers
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// define app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// If in prod, use cors
if(process.env.NODE_ENV != 'production'){
  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  }
  // defining middleware
  app.use(cors(corsOptions)); //allow requests from any origin
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
