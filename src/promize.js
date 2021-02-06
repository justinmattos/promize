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
    setTimeout(() => {
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
    }, 0);
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

  this.catch = function (rejectOn) {
    if (rejectOn instanceof Error) {
      setTimeout(this.reject(rejectOn), 0);
    }
    if (!this.isDone) {
      if (typeof rejectOn === 'function') {
        this.rejectMethods.push(rejectOn);
      }
    } else {
      if (this.state === 'rejected') {
        if (typeof rejectOn === 'function') {
          rejectOn(this.value);
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
