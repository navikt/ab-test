/* eslint-disable no-param-reassign */
const path = require('path');
const express = require('express');
const fileExists = require("../lib/fileExists");

let entryFile;
let ingresses;

const preprocessBaseUrl = (req) => {
  if (!req.baseUrl) return;
  let modifiedBaseUrl = req.baseUrl;
  ingresses.map((i) => RegExp(`^${i}`))
      .forEach((regExp) => modifiedBaseUrl = modifiedBaseUrl.replace(regExp, ''))
  return modifiedBaseUrl;
}

const distributionMiddleware = (req, res, next) => {
  try {
    const {
      dist, dists, distPath, distFolder, distributionToggles,
    } = req.locals;
    req.locals.entryFile = entryFile;
    req.locals.ingresses = ingresses;
    req.locals.modifiedBaseUrl = preprocessBaseUrl(req);
    const filteredPaths = dists.filter((d) => d === dist && distributionToggles[d]);
    if (filteredPaths.length === 1) {
      if (!req.baseUrl || ingresses.includes(req.baseUrl)) {
        return res.sendFile(path.resolve(distFolder, dist, entryFile));
      }
      const filePath = path.join(dist, req.locals.modifiedBaseUrl);
      if (fileExists(`${distPath}/${filePath}`)) {
        return res.sendFile(filePath, { root: distPath, index: false });
      } else {
        next();
      }
    }
  } catch (e) {
    return next(e);
  }
  return next();
};

const createDistributionMiddleware = (options) => {
  entryFile = options.entryFile || 'index.html';
  ingresses = options.ingresses || ['/'];
  const router = express.Router();
  router.use('*', distributionMiddleware);
  return router;
};

module.exports = { distributionMiddleware, createDistributionMiddleware };
