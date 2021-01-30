function Promize(exFunc) {
  if (typeof exFunc !== 'function') {
    throw 'BAD!';
  }
  this.state = undefined;
  this.then = (fulfillFunc = () => {}) => {
    if (typeof fulfillFunc === 'function') fulfillFunc();
  };
  this.catch = () => {};
  const resolve = (...args) => {
    this.then(args);
  };
  const reject = (...args) => {
    this.catch(args);
  };
  this.result = exFunc(resolve, reject);
}

module.exports = Promize;
