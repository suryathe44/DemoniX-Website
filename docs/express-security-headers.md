# Express security headers for DemoniX

The deployed website uses Node's built-in HTTP server. Its current policy is in `server.js`. If moving to Express, register one of these alternatives before all routes and error handlers. `connect-src 'self'` preserves same-origin analytics beacons. The current page needs no inline scripts or styles.

## Method A: manual middleware

```js
import express from 'express';
const app = express();
app.disable('x-powered-by');
const csp = [
  "default-src 'self'", "script-src 'self'", "style-src 'self'",
  "connect-src 'self'", "object-src 'none'", "base-uri 'self'",
  "frame-src 'none'", "frame-ancestors 'none'", "form-action 'self'"
].join('; ');
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', csp);
  next();
});
// Register existing API and static routes here.
app.use((_req, res) => res.status(404).type('text/plain').send('Not found'));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (!res.headersSent) res.status(500).type('text/plain').send('Server error');
});
```

## Method B: Helmet with explicit overrides

Install `express` and `helmet` in an Express project. The current Node server needs neither package.

```js
import express from 'express';
import helmet from 'helmet';
const app = express();
app.use(helmet({
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true,
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: true },
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'"],
      connectSrc: ["'self'"], objectSrc: ["'none'"], baseUri: ["'self'"],
      frameSrc: ["'none'"], frameAncestors: ["'none'"], formAction: ["'self'"]
    }
  }
}));
// Register existing API and static routes here.
app.use((_req, res) => res.status(404).type('text/plain').send('Not found'));
app.use((error, _req, res, _next) => {
  console.error(error);
  if (!res.headersSent) res.status(500).type('text/plain').send('Server error');
});
```

Both fixed policies add negligible server work and do not change API payloads. Keep HTTPS working on every subdomain before retaining `includeSubDomains; preload`. The token alone does not submit the domain to browser preload lists. Verify responses through Cloudflare after deployment.

References: [Helmet](https://helmetjs.github.io/) and [MDN HSTS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security).
