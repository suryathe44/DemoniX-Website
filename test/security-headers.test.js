const test = require('node:test');
const assert = require('node:assert/strict');
const { server } = require('../server');

test('security headers cover successful and error responses', async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const [route, options, status] of [
      ['/', {}, 200],
      ['/styles.css', {}, 200],
      ['/missing', {}, 404],
      ['/.git/config', {}, 404],
      ['/server.js', {}, 404],
      ['/', { method: 'POST' }, 405]
    ]) {
      const response = await fetch(base + route, options);
      assert.equal(response.status, status, route);
      assert.equal(response.headers.get('x-frame-options'), 'DENY');
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000; includeSubDomains; preload');
      const csp = response.headers.get('content-security-policy');
      for (const directive of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-src 'none'", "frame-ancestors 'none'", "connect-src 'self'"]) {
        assert.ok(csp.includes(directive), `${route}: missing ${directive}`);
      }
      assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
