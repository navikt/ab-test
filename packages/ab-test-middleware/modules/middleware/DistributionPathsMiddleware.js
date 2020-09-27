/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const express = require('express');

let paths;
let distPath;
let distFolder;

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
    req.locals.distPath = distPath;
    req.locals.distFolder = distFolder;
    if (req.locals.dists.length === 0) {
      return next(new Error('At least one distribution is required to run this middleware.'));
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

const createDistributionPathsMiddleware = (options) => {
  distFolder = options.distFolder || 'dist';
  distPath = `./${distFolder}`;
  const router = express.Router();
  router.use(distributionPathsMiddleware);
  return router;
};

module.exports = { createDistributionPathsMiddleware };
