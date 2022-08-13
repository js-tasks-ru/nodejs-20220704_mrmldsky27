const http = require('http');
const path = require('path');
const fs = require('node:fs');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Некорректное имя файла');
        return;
      }

      const limitStream = new LimitSizeStream({limit: 1024 * 1024});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', (err) => {
        // limitStream.destroy();
        // writeStream.destroy();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }

        if (err.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('Файл слишком большой');
        } else {
          res.statusCode = 500;
          res.end('internal error');
        }
      });

      writeStream.on('error', (err) => {
        // limitStream.destroy();
        // writeStream.destroy();
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('already exists');
        } else {
          res.statusCode = 500;
          res.end('internal error');
        }
      });

      writeStream.on('end', () => {
        res.statusCode = 201;
        res.end(`Файл ${pathname} был успешно загружен`);
      });

      req.on('abort', (e) => {
        limitStream.destroy();
        writeStream.destroy();

        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
