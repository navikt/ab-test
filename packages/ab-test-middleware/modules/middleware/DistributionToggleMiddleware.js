/* eslint-disable no-param-reassign */
const express = require('express');

let defaultDist;
let distributionToggleInterpreter;

const distributionToggleMiddleware = (req, res, next) => {
  try {
    let atLeastOneDistributionEnabled = false;
    if (!req.locals) req.locals = {};
    req.locals.defaultDist = defaultDist;
    req.locals.distributionToggles = req.locals.dists.reduce((acc, curr) => {
      if (curr === defaultDist) {
        acc[curr] = true;
      } else {
        acc[curr] = distributionToggleInterpreter(curr);
      }
      if (acc[curr]) {
        atLeastOneDistributionEnabled = true;
      }
      return acc;
    }, {});
    if (!atLeastOneDistributionEnabled) {
      return next(new Error('You must enable at least one distribution to run this middleware.'));
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

const createDistributionToggleMiddleware = (options) => {
  defaultDist = options.defaultDist || 'master';
  distributionToggleInterpreter = options.distributionToggleInterpreter;
  const router = express.Router();
  router.use(distributionToggleMiddleware);
  return router;
};

module.exports = { createDistributionToggleMiddleware };
