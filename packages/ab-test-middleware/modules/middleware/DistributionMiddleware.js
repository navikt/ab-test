/* eslint-disable no-param-reassign */
const path = require('path');
const express = require('express');

let entryFile;

const distributionMiddleware = (req, res, next) => {
  try {
    const {
      dist, dists, distPath, distFolder, distributionToggles,
    } = req.locals;
    req.locals.entryFile = entryFile;
    const filteredPaths = dists.filter((d) => d === dist && distributionToggles[d]);
    if (filteredPaths.length === 1) {
      if (!req.baseUrl) return res.sendFile(path.resolve(distFolder, dist, entryFile));
      return res.sendFile(path.join(dist, req.baseUrl), { root: distPath, index: false });
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

const createDistributionMiddleware = (options) => {
  entryFile = options.entryFile || 'index.html';
  const router = express.Router();
  router.use('*', distributionMiddleware);
  return router;
};

module.exports = { createDistributionMiddleware };
