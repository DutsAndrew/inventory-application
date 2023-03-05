const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// db hookups w/ MongoDB and Mongoose
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const mongoDB = 'mongodb+srv://admin:admin@cluster0.0bccweu.mongodb.net/local_inventory?retryWrites=true&w=majority';

async function main() {
  await mongoose.connect(mongoDB);
};

main().catch(err => console.log(err));

// // // // //

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);
app.use('/images/', express.static('./public/data/uploads/'));

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
