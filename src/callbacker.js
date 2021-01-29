const syncCallbacker = (firstFunc, secondFunc, ...remArgs) => {
  if (typeof firstFunc !== 'function' || typeof secondFunc !== 'function') {
    throw 'syncError';
  }

  let result = secondFunc(firstFunc());

  while (remArgs.length) {
    let currFunc = remArgs.shift();
    result = currFunc(result);
  }

  return result;
};

const asyncCallbacker = (firstFunc, secondFunc, ...remArgs) => {
  if (typeof firstFunc !== 'function' || typeof secondFunc !== 'function') {
    throw 'asyncError!';
  }

  let data;

  const done = (newData) => {
    let result = secondFunc(newData, done);
    while (remArgs.length) {
      let nextFunc = remArgs.shift();
      result = nextFunc(result, done);
    }
    return result;
  };

  return firstFunc(data, done);
};

module.exports = { syncCallbacker, asyncCallbacker };
