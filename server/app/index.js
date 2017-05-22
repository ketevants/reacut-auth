'use strict';

var app = require('express')();
var path = require('path');

var HttpError = require('../utils/HttpError');

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));


// "Responding" middleware (may send a response back to client)

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

// Error handling middleware

app.use(HttpError(404).middleware());

app.use(function (err, req, res, next) {
  err.status = err.status || 500;
  console.error(err.stack);
  var html = [
    '<html><body>',
    '<p>ERROR: ', err.status, ' - ', err.message, '</p>',
    '<p>VERB: ', req.method, '</p>',
    '<p>URL: ', req.originalUrl, '</p>',
    '<p>QUERY ', JSON.stringify(req.query), '</p>',
    '<p>BODY: ', JSON.stringify(req.body), '</p>',
    '<pre>', err.stack, '</pre>',
    '</body></html>'
  ].join('');
  res.status(err.status).send(html);
});

module.exports = app;
