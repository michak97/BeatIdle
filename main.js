const loop = new GameLoop();

let currency = 0;
let currency_per_millisecond = 0.003;

let currencyEl = document.querySelector('#currency');

loop.onUpdate = function(dt, t) {
  currency += currency_per_millisecond * dt;
};

loop.onRender = function(i) {
  currencyEl.textContent = currency.toFixed(2);
};

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

loop.start();