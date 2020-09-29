const express = require('express');

let qual;

const middlewareErrorHandler = (err, req, res, next) => {
  if (err) console.error(qual, err);
  return next();
};

const createMiddlewareErrorHandler = (qualifier) => {
  qual = qualifier;
  const router = express.Router();
  router.use(middlewareErrorHandler);
  return router;
};

module.exports = { middlewareErrorHandler, createMiddlewareErrorHandler };
