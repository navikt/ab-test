/* eslint-disable no-param-reassign */
const express = require('express');

const cookieAge = 604800000 * 2;
let testGroupToggleInterpreter;
let randomizeTestDistribution;

const testGroupAssignationMiddleware = (req, res, next) => {
  try {
    const {
      dist,
      defaultDist,
      distributionToggles,
      isInTestGroup,
      cookieName,
    } = req.locals;
    if (isInTestGroup && distributionToggles[dist]) {
      return next();
    }
    let testGroupAssigned = false;
    const toggles = randomizeTestDistribution
      ? Object.keys(distributionToggles).sort(() => Math.random() - 0.5)
      : Object.keys(distributionToggles);
    toggles.forEach((d) => {
      if (!testGroupAssigned
        && d !== defaultDist
        && distributionToggles[d]
        && testGroupToggleInterpreter(d)) {
        testGroupAssigned = true;
        req.locals.isInTestGroup = true;
        req.locals.dist = d;
      }
    });
    if (!testGroupAssigned) {
      req.locals.isInTestGroup = true;
      req.locals.dist = defaultDist;
    }
    res.cookie(cookieName, req.locals.dist, { maxAge: cookieAge });
  } catch (e) {
    return next(e);
  }
  return next();
};

const createTestGroupAssignationMiddleware = (options) => {
  testGroupToggleInterpreter = options.testGroupToggleInterpreter;
  randomizeTestDistribution = options.randomizeTestGroupDistribution;
  const router = express.Router();
  router.use(testGroupAssignationMiddleware);
  return router;
};

module.exports = { testGroupAssignationMiddleware, createTestGroupAssignationMiddleware };
