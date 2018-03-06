'use strict';


const requestLogger = function(req, res, next) {
  const now = new Date();

  console.log(`logger : ${now.toLocaleString()} : ${req.method} : ${req.url}`);

  next();
};

module.exports = requestLogger;
