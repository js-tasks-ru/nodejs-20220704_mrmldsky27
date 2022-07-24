const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this._currentSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentSize += chunk.length;

    if (this.currentSize <= this.limit) {
      callback(null, chunk);
    } else {
      this.destroy(new LimitExceededError());
    }
  }

  get currentSize() {
    return this._currentSize;
  }

  set currentSize(value) {
    this._currentSize = value;
  }
}

module.exports = LimitSizeStream;
