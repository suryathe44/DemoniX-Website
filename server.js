const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 5175;
const publicFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
  "/script.js": ["script.js", "application/javascript; charset=utf-8"]
};

// The current page uses local scripts and styles; no external resource hosts
// or inline-code exceptions are required.
const securityHeaders = Object.freeze({
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'"
  ].join("; "),
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
});

const server = http.createServer((request, response) => {
  // Applied before routing, including 404, 405, and I/O error responses.
  for (const [name, value] of Object.entries(securityHeaders)) response.setHeader(name, value);

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, "http://localhost").pathname;
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  // An explicit allowlist prevents serving .git, .env, source, and private files.
  const asset = Object.hasOwn(publicFiles, pathname) ? publicFiles[pathname] : null;
  if (!asset) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  fs.readFile(path.join(__dirname, asset[0]), (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": asset[1],
      "Content-Length": content.length
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

if (require.main === module) {
  server.listen(port, "0.0.0.0", () => {
    console.log(`DemoniX site running on 0.0.0.0:${port}`);
  });
}

module.exports = { server, securityHeaders };
