const { CRON_SECRET } = require('../config');

const assertCronAuth = (req) => {
  if (!CRON_SECRET) return;

  const authHeader = req?.headers?.authorization || req?.headers?.Authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (token !== CRON_SECRET) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
};

module.exports = assertCronAuth;
