const path = require('path');
const express = require('express');

const defaultDistributionMiddleware = (req, res, next) => {
  try {
    const {
      distFolder, defaultDist, distPath, entryFile, ingresses, modifiedBaseUrl
    } = req.locals;
    if (!req.baseUrl || ingresses.includes(req.baseUrl)) {
      return res.sendFile(path.resolve(distFolder, defaultDist, entryFile));
    }
    return res.sendFile(path.join(defaultDist, modifiedBaseUrl), { root: distPath, index: false });
  } catch (e) {
    return next(e);
  }
};

const createDefaultDistributionMiddleware = () => {
  const router = express.Router();
  router.use('*', defaultDistributionMiddleware);
  return router;
};

module.exports = { defaultDistributionMiddleware, createDefaultDistributionMiddleware };
