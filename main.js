const loop = new GameLoop();

const stats = {
  money: 0,
  moneyPerClick: 1,
  BeatAccuracy: 1,
}

let oldStats = { ...stats}

const BPM = 90;
const singleBeatTime = 60000/BPM;
let lastSingleBeatTime = 0;
let currency = 0;
let currency_per_millisecond = 0;

const BeatEl = document.querySelector('#beatTime');
const BPMEl = document.querySelector('#BPM');
const TSLBEl = document.querySelector('#timeSinceLastBeat');
const LSBTEl = document.querySelector('#lastSingleBeatTime');

BPMEl.textContent = BPM.toString();
TSLBEl.textContent = ((loop.timing.delta)-lastSingleBeatTime).toFixed(2);
LSBTEl.textContent = lastSingleBeatTime.toFixed(2);

const currencyEl = document.querySelector('#currency');
const BeatButton = document.querySelector('#clicker');

BeatButton.addEventListener('click', () => {
  stats.money += stats.moneyPerClick;
})

loop.onUpdate = function(dt, t) {
  currency += currency_per_millisecond * dt;
};

loop.onRender = function(i) {
  currencyEl.textContent = currency.toFixed(2);
  BeatEl.textContent = singleBeatTime.toFixed(2);
};

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

loop.start();