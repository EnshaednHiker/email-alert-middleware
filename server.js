'use strict';

const express = require('express');
const morgan = require('morgan');
// this will load our .env file if we're
// running locally. On Gomix, .env files
// are automatically loaded.
require('dotenv').config();

const {logger} = require('./utilities/logger');
// these are custom errors we've created
const {FooError, BarError, BizzError} = require('./errors');

const {ALERT_FROM_NAME} = process.env; 
const {ALERT_TO_EMAIL} = process.env;
const {ALERT_FROM_EMAIL} = process.env;

const {sendEmail} = require('./emailer'); 

const app = express();

// this route handler randomly throws one of `FooError`,
// `BarError`, or `BizzError`
const russianRoulette = (req, res) => {
  const errors = [FooError, BarError, BizzError];
  throw new errors[
    Math.floor(Math.random() * errors.length)]('It blew up!');
};


app.use(morgan('common', {stream: logger.stream}));

// for any GET request, we'll run our `russianRoulette` function
app.get('*', russianRoulette);

// YOUR MIDDLEWARE FUNCTION should be activated here using
// `app.use()`. It needs to come BEFORE the `app.use` call
// below, which sends a 500 and error message to the client
app.use((err, req, res, next) => {
  
  //this was counterintuitive to put this here but makes perfect sense in hindsight.
  //I kept trying to change the emailData object to include this stuff from emailer.js
  const emailData = {
  from: ALERT_FROM_EMAIL,
  to: ALERT_TO_EMAIL,
  subject: `${ALERT_FROM_NAME}: ${err.name}`,
  text: `Something went wrong. Message: ${err.message}. Stack trace: ${err.stack}`,
  html: `<p>Something went wrong. Message: ${err.message}. Stack trace: ${err.stack}</p>`
}
  
  //I don't understand why the solution code called for instanceof, I used === instead
  //alright, BizzErrors are getting sent as emails too.
  //was still getting bizzErrors sent when I had: err instanceof FooError || BarError.  Why?
 
  if (err instanceof FooError || err instanceof BarError){
    sendEmail(emailData); //sendMail[`Error message: ${err.message}, stack trace: ${err.stack}`];
    //I had this here but the solution had is outside of the if statement closing brace, why? next(err);
  }
  next(err);
});


app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({error: 'Something went wrong'}).end();
});

const port = process.env.PORT || 8080;

const listener = app.listen(port, function () {
  logger.info(`Your app is listening on port ${port}`);
});
