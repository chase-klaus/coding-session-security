const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { getClient } = require('../models/crud');

const verify = (token, secret) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

const authMW = async (req, res, next) => {
  const { headers } = req;
  const cid = headers['x-client-id'] || req.query.cid;
  const [, token] = (headers.authorization || '').split(/\s+/);
  if (!token || !cid) res.status(401).json({ error: 'Not Authorized' });

  try {
    const client = await getClient(cid);
    const { pid } = await verify(token, client.secret);
    req.user = { cid, pid, secret: client.secret };
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server error', status: 500 });
  }
};

module.exports = authMW;
