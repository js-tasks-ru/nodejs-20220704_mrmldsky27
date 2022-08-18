const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.prevChunk = '';
  }

  _transform(chunk, encoding, callback) {
    if (chunk.toString().includes(os.EOL)) {
      const chunkArray = chunk.toString().split(os.EOL);

      for (let i = 0; i < chunkArray.length; i++) {
        if (i === 0) {
          this.push(this.prevChunk + chunkArray[i]);
        } else if (i !== chunkArray.length - 1) {
          this.push(chunkArray[i]);
        } else {
          this.prevChunk = chunkArray[i];
        }
      }
      callback();
    } else {
      this.prevChunk = this.prevChunk + chunk.toString();
      callback(null, Buffer.alloc(0));
    }
  }

  _flush(callback) {
    this.push(this.prevChunk);
    callback();
  }
}

module.exports = LineSplitStream;
