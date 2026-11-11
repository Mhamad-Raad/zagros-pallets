// Vercel cron (nightly, see vercel.json): puts the public demo back to fresh demo data.
const { resetDemo } = require('../apps/api/bundle/demo-reset.cjs');

module.exports = async (req, res) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.statusCode = 401;
    return res.end('unauthorized');
  }
  try {
    await resetDemo();
    res.statusCode = 200;
    res.end('demo data reset');
  } catch (error) {
    console.error('[demo-reset] failed:', error);
    res.statusCode = 500;
    res.end('reset failed');
  }
};
