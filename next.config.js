const { withClerkMiddleware } = require("@clerk/nextjs/server");

module.exports = withClerkMiddleware({
  reactStrictMode: true,
});