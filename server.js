const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = process.env.PORT || 5175;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const server = http.createServer((request, response) => {
  try {
    const urlPath = decodeURIComponent(
      new URL(request.url, `http://${request.headers.host}`).pathname
    );

    const requestPath =
      urlPath === "/" ? "index.html" : urlPath.replace(/^[/\\]+/, "");

    const safePath = path
      .normalize(requestPath)
      .replace(/^(\.\.[/\\])+/, "");

    const filePath = path.join(root, safePath);

    // Prevent access outside the project directory
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type":
          types[path.extname(filePath)] || "application/octet-stream"
      });

      response.end(content);
    });
  } catch (err) {
    response.writeHead(400);
    response.end("Bad request");
  }
});

// Render requires the web service to listen on 0.0.0.0
server.listen(port, "0.0.0.0", () => {
  console.log(`DemoniX site running on 0.0.0.0:${port}`);
});
