const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }
      fs.stat(filepath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal error');
          }
        } else {
          const isFile = stats.isFile();
          if (isFile) {
            const stream = fs.createReadStream(filepath);
            stream.pipe(res);
            stream.on('error', (err) => console.error(err));
            req.on('aborted', () => stream.destroy());

            stream.on('close', () => {
              res.statusCode = 200;
              res.end();
            });
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

server.on('error', (err) => {
  console.error(err);
  res.statusCode = 500;
  res.end('Internal error');
});

module.exports = server;
