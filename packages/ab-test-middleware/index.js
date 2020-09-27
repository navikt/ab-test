const express = require('express');
const {
  createCookieMiddleware,
  createDefaultDistributionMiddleware,
  createDistributionMiddleware,
  createDistributionPathsMiddleware,
  createDistributionToggleMiddleware,
  createMiddlewareErrorHandler,
  createTestGroupAssignationMiddleware,
} = require('./modules');

const validateOpts = (options) => {
  const isFunc = (fn) => fn && {}.toString.call(fn) === '[object Function]';

  if (!options.distributionToggleInterpreter) {
    throw new Error('A toggle interpreter is required to run this middleware');
  }
  if (!options.testGroupToggleInterpreter) {
    throw new Error('A test group toggle interpreter is required to run this middleware');
  }
  // eslint-disable-next-line max-len
  if (!isFunc(options.distributionToggleInterpreter) || !isFunc(options.testGroupToggleInterpreter)) {
    throw new Error('Toggle interpreters must be functions that take a distribution name as a parameter and return a boolean value.');
  }
};

const createAbTestMiddleware = (options) => {
  validateOpts(options);
  const router = express.Router();
  router.use(createDistributionPathsMiddleware(options));
  router.use(createDistributionToggleMiddleware(options));
  router.use(createCookieMiddleware(options));
  router.use(createTestGroupAssignationMiddleware(options));
  router.use(createMiddlewareErrorHandler('pre-dist'));
  router.use(createDistributionMiddleware(options));
  router.use(createDefaultDistributionMiddleware);
  router.use(createMiddlewareErrorHandler('catch-all'));
  return router;
};

module.exports = { createAbTestMiddleware };
