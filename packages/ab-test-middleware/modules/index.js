const { createCookieMiddleware } = require('./middleware/CookieMiddleware');
const { createDefaultDistributionMiddleware } = require('./middleware/DefaultDistributionMiddleware');
const { createDistributionMiddleware } = require('./middleware/DistributionMiddleware');
const { createDistributionPathsMiddleware } = require('./middleware/DistributionPathsMiddleware');
const { createDistributionToggleMiddleware } = require('./middleware/DistributionToggleMiddleware');
const { createMiddlewareErrorHandler } = require('./middleware/MiddlewareErrorHandler');
const { createTestGroupAssignationMiddleware } = require('./middleware/TestGroupAssignationMiddleware');

module.exports = {
  createCookieMiddleware,
  createDefaultDistributionMiddleware,
  createDistributionMiddleware,
  createDistributionPathsMiddleware,
  createDistributionToggleMiddleware,
  createMiddlewareErrorHandler,
  createTestGroupAssignationMiddleware,
};
