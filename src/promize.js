/* First attempt
function Promize(exFunc) {
  if (typeof exFunc !== 'function') {
    throw 'BAD!';
  }
  this.value = undefined;
  this.then = (fulfillFunc = () => {}) => {
    exFunc(fulfillFunc);
    return new Promize(fulfillFunc(this.value));
  };
  this.catch = () => {};
  const resolve = (value) => {
    this.value = value;
  };
  const reject = (value) => {
    this.value = value;
  };
  exFunc(resolve, reject);
}
*/

/* Second attempt
function Promize(exFunc) {
  if (typeof exFunc !== 'function') {
    throw 'BAD!';
  }
  this.executor = exFunc;
  this.state = undefined;
  this.fulfillMethods = new Array(0);
  this.rejectMethods = new Array(0);
  this.isDone = false;
  this.value = undefined;

  this.resolve = function (val = undefined) {
    // console.log(this);
    if (this.isDone === false) {
      this.state = 'resolved';
      this.isDone = true;
      this.value = val;
      this.then();
    }
  }.bind(this);

  this.reject = function (val) {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.catch(val);
    }
  }.bind(this);

  this.handleMethods = function (methods) {
    //something here to properly chain after resolution??
    //Introduce a recursive call to extract Promizes??
    console.log(this.value, methods);
    if (methods.length < 1) return new Promize(methods[0]);
    else {
      let currFunc = methods.shift();
      console.log(methods);
      if (currFunc(this.value) instanceof Promize) {
        console.log('Method returns a Promize');
        return currFunc(this.value);
      } else {
        this.value = currFunc(this.value);
        return this.handleMethods(methods);
      }
    }
    // methods.forEach((method) => {
    //   this.value = method(this.value);
    // });
  }.bind(this);

  this.then = function (fulfillFunc = () => {}, rejectFunc = () => {}) {
    console.log(this.value, this.state, this.fulfillMethods, fulfillFunc);
    switch (this.state) {
      case undefined:
        this.fulfillMethods.push(fulfillFunc);
        this.rejectMethods.push(rejectFunc);
        return this;
        break;
      case 'resolved':
        if (this.fulfillMethods.length > 0) {
          let reaction = this.fulfillMethods;
          this.handleMethods(reaction);
        }
        return new Promize(fulfillFunc);
        break;
      case 'rejected':
        //and another thing here
        break;
    }
    return this;
  }.bind(this);

  this.catch = function (rejectFunc) {
    if (typeof rejectFunc === 'function') this.catch = rejectFunc;
  }.bind(this);

  exFunc(this.resolve, this.reject);
}
*/

function Promize(exFunc) {
  if (typeof exFunc !== 'function') {
    throw 'BAD!';
  }
  this.executor = exFunc;
  this.state = undefined;
  this.isDone = false;
  this.value = undefined;
  this.fulfillMethods = [];
  this.rejectMethods = [];

  this.resolve = function resolve(value) {
    if (!this.isDone) {
      this.isDone = true;
      this.state = 'resolved';
      this.value = value;
      let currFunc;
      while (this.fulfillMethods.length > 0) {
        currFunc = this.fulfillMethods.shift();
        this.then(currFunc);
      }
    }
  }.bind(this);

  this.then = function then(fulfillFunc, rejectFunc) {
    if (!this.isDone) {
      if (typeof fulfillFunc === 'function') {
        this.fulfillMethods.push(fulfillFunc);
      }
      if (typeof rejectFunc === 'function') {
        this.rejectMethods.push(rejectFunc);
      }
    } else {
      if (this.state === 'resolved') {
        if (typeof fulfillFunc === 'function') {
          let newPromize = fulfillFunc(this.value);
          if (newPromize instanceof Promize) {
            newPromize.value = this.value;
            newPromize.fulfillMethods = [...this.fulfillMethods];
            newPromize.rejectMethods = [...this.rejectMethods];
            this.fulfillMethods = [];
            return newPromize;
          }
        }
      } else if (this.state === 'rejected') {
        if (typeof rejectFunc === 'function') {
          let newPromize = fulfillFunc(this.value);
          if (newPromize instanceof Promize) {
            newPromize.value = this.value;
            newPromize.rejectMethods = [...this.rejectMethods];
            this.rejectMethods = [];
            return newPromize;
          }
        }
      }
    }
    return this;
  }.bind(this);

  this.reject = function reject(reazon) {
    setTimeout(() => {
      if (!this.isDone) {
        this.isDone = true;
        this.state = 'rejected';
        this.value = reazon;
        let currFunc;
        while (this.rejectMethods.length > 0) {
          currFunc = this.rejectMethods.shift();
          this.catch(currFunc);
        }
      }
    }, 0);
  }.bind(this);

  this.catch = function (rejectFunc) {
    if (rejectFunc instanceof Error) {
      setTimeout(this.reject(rejectFunc), 0);
    }
    if (!this.isDone) {
      if (typeof rejectFunc === 'function') {
        this.rejectMethods.push(rejectFunc);
      }
    } else {
      if (this.state === 'rejected') {
        if (typeof rejectFunc === 'function') {
          rejectFunc(this.value);
        }
      }
    }
  }.bind(this);

  try {
    this.executor(this.resolve, this.reject);
  } catch (err) {
    this.catch(err);
  }
}

module.exports = Promize;
