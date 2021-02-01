// function Promize(exFunc) {
//   if (typeof exFunc !== 'function') {
//     throw 'BAD!';
//   }
//   this.value = undefined;
//   this.then = (fulfillFunc = () => {}) => {
//     exFunc(fulfillFunc);
//     return new Promize(fulfillFunc(this.value));
//   };
//   this.catch = () => {};
//   const resolve = (value) => {
//     this.value = value;
//   };
//   const reject = (value) => {
//     this.value = value;
//   };
//   exFunc(resolve, reject);
// }

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
      if (this.fulfillMethods) {
        let reaction = this.fulfillMethods;
        this.handleMethods(reaction);
      }
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
    methods.forEach((method) => {
      method(this.value);
    });
  }.bind(this);

  this.then = function (fulfillFunc, rejectFunc) {
    // console.log(this.state);
    switch (this.state) {
      case undefined:
        this.fulfillMethods.push(fulfillFunc);
        this.rejectMethods.push(rejectFunc);
        break;
      case 'resolved':
        //need to do something here
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

module.exports = Promize;
