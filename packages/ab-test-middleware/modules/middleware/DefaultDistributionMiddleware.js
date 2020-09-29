const path = require('path');
const express = require('express');

const defaultDistributionMiddleware = (req, res, next) => {
  try {
    const {
      distFolder, defaultDist, distPath, entryFile,
    } = req.locals;
    if (!req.baseUrl) return res.sendFile(path.resolve(distFolder, defaultDist, entryFile));
    return res.sendFile(path.join(defaultDist, req.baseUrl), { root: distPath, index: false });
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
