function Promize(exFunc) {
  if (typeof exFunc !== 'function') {
    throw 'BAD!';
  }
  this.then = (fulfillFunc = () => {}) => {};
  this.catch = () => {};
  const resolve = (val) => {
    this.then(val);
  };
  const reject = () => {
    this.catch();
  };
  exFunc(resolve, reject);
}

module.exports = Promize;
