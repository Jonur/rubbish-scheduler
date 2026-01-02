const assertCronAuth = (req) => {
  const expected = process.env.CRON_SECRET;

  // Allow local/dev runs without auth
  if (!expected) return;

  const authHeader = req.headers.authorization || req.headers.Authorization || '';

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (token !== expected) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
};

module.exports = assertCronAuth;
