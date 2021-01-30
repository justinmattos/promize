const basicPromise = new Promise((resolve, reject) => {
  resolve('basicPromise');
});

const funcPromise = () =>
  new Promise((resolve, reject) => {
    resolve('funcPromise');
  });

const chainedPromise = (prom = () => {}) => {
  return new Promise((resolve, reject) => {
    resolve(prom());
  });
};
const rejectedPromise = () =>
  new Promise((resolve, reject) => {
    reject(() => {
      throw 'rejectedPromise';
    });
  });

module.exports = { basicPromise, chainedPromise, rejectedPromise, funcPromise };
