// Vercel function for the public demo: every /api/* request is rewritten here (see vercel.json).
const { handler } = require('../apps/api/bundle/serverless.cjs');

module.exports = (req, res) => handler(req, res);
