require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const {expressjwt: jwt} = require('express-jwt');
const jwks = require('jwks-rsa');
const mongoose = require("mongoose");

var indexRouter = require('./routes/index');

var app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', function() {
    console.log("MongoDB database connection established successfully");
  });
}

app.use(cors());

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH_DOMAIN,
  }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: ['RS256'],
});

app.use((req, res, next) => {
  verifyJwt(req, res, (err) => {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(401).send('Token expired');
    }
    console.log('JWT validated');
    next();
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // log error
  console.error(err);

  // send error as JSON
  res.status(err.status || 500);
  res.json({ message: err.message, error: res.locals.error });
});

module.exports = app;