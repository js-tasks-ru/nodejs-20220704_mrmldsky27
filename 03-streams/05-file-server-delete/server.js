const http = require('http');
const path = require('path');

const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Неверный запрос');
      } else {
        fs.unlink(filepath, (err) => {
          if (err) {
            if (err.code === 'ENOENT') {
              res.statusCode = 404;
              res.end('Файл не найден');
            } else {
              res.statusCode = 500;
              res.end('Ошибка на сервере');
            }
          } else {
            res.statusCode = 200;
            res.end('Файл был удален');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
