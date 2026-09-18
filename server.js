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

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, "http://localhost").pathname;
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const asset = Object.hasOwn(publicFiles, pathname) ? publicFiles[pathname] : null;
  if (!asset) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  fs.readFile(path.join(__dirname, asset[0]), (error, content) => {
    if (error) {
      response.writeHead(500);
      response.end("Server error");
      return;
    }

    response.writeHead(200, {
      "Content-Type": asset[1],
      "Content-Length": content.length,
      "X-Content-Type-Options": "nosniff"
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`DemoniX site running on 0.0.0.0:${port}`);
});
