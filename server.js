const PORT = 5500;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const pathname = new URL(req.url).pathname;

    if (pathname === "/" || pathname === "") {
      return new Response(await Bun.file("index.html").text(), {
        headers: { "Content-Type": "text/html" }
      });
    }

    const file = Bun.file("." + pathname);
    if (await file.exists()) {
      const contentType = getContentType(pathname);
      return new Response(file, {
        headers: { "Content-Type": contentType }
      });
    }

    return new Response("404 Not Found", { status: 404 });
  }
});

function getContentType(pathname) {
  if (pathname.endsWith(".html")) return "text/html";
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".js")) return "text/javascript";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

console.log(`✓ Server running at http://localhost:${PORT}`);
