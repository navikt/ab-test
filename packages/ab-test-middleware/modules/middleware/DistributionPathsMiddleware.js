/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const express = require('express');

let paths;
let distPath;
let distFolder;
let defaultDist;

const distributionPaths = () => {
  if (paths) return paths;
  paths = fs.readdirSync(distPath)
    .map((f) => path.join(distPath, f))
    .filter((f) => fs.statSync(f).isDirectory())
    .map((f) => f.replace(`${distFolder}/`, ''));
  return paths;
};

const distributionPathsMiddleware = (req, res, next) => {
  try {
    if (!req.locals) req.locals = {};
    req.locals.dists = distributionPaths();
    req.locals.defaultDist = defaultDist;
    req.locals.distPath = distPath;
    req.locals.distFolder = distFolder;
    if (req.locals.dists.length === 0) return next(new Error('At least one distribution is required to run this middleware.'));
    if (!req.locals.dists.includes(defaultDist)) return next(new Error('Default distribution does not match any available distributions.'));
  } catch (e) {
    return next(e);
  }
  return next();
};

const createDistributionPathsMiddleware = (options) => {
  if (paths) paths = undefined; // Mainly for testing purposes
  distFolder = options.distFolder || 'dist';
  defaultDist = options.defaultDist || 'master';
  distPath = `./${distFolder}`;
  const router = express.Router();
  router.use(distributionPathsMiddleware);
  return router;
};

module.exports = { distributionPathsMiddleware, createDistributionPathsMiddleware };
