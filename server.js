'use strict';


const morgan = require('morgan');
const { PORT } = require('./config');
const express = require('express');
const  requestLogger  = require('./middleware/logger');
const notesRouter = require('./routers/note.router');
const app = express();




console.log('hello world!');



app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(requestLogger);
app.use(notesRouter);






app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});




app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
