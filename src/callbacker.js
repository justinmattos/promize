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

  let data,
    step = -1,
    fin = remArgs.length;

  const done = (newData) => {
    if (step < 0) {
      step++;
      return secondFunc(newData, done);
    } else if (step <= fin) {
      let nextFunc = remArgs[step];
      step++;
      return nextFunc(newData, done);
    }
  };

  return firstFunc(data, done);
};

module.exports = { syncCallbacker, asyncCallbacker };
