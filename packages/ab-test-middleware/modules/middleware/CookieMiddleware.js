/* eslint-disable no-param-reassign */
const express = require('express');

let cookieName;

const getCookie = (req) => {
  const re = new RegExp(`${cookieName}=([^;]+)`);
  const match = re.exec(req.headers.cookie);
  return match !== null ? match[1] : '';
};

const cookieMiddleware = (req, res, next) => {
  try {
    const { defaultDist } = req.locals;
    req.locals.cookieName = cookieName;
    if (req.headers && req.headers.cookie && req.headers.cookie.includes(cookieName)) {
      req.locals.dist = getCookie(req);
      req.locals.isInTestGroup = true;
    } else {
      req.locals.dist = defaultDist;
      req.locals.isInTestGroup = false;
    }
  } catch (e) {
    next(e);
  }
  return next();
};

const createCookieMiddleware = (options) => {
  cookieName = options.cookieName || 'testGroup';
  const router = express.Router();
  router.use(cookieMiddleware);
  return router;
};

module.exports = { getCookie, cookieMiddleware, createCookieMiddleware };
