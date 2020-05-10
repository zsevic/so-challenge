export default () => ({
  PORT: process.env.PORT || 8080,
  SENTRY_DSN: process.env.SENTRY_DSN || 'sentry_dsn',
});
