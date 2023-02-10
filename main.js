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
const SBTEl = document.querySelector('#singleBeatTime');
const LSBTEl = document.querySelector('#lastSingleBeatTime');
const DeltaEl = document.querySelector('#delta');

BPMEl.textContent = BPM.toString();
SBTEl.textContent = singleBeatTime.toString();

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
  LSBTEl.textContent = lastSingleBeatTime.toFixed(2);
  BeatEl.textContent = singleBeatTime.toFixed(2);
  DeltaEl.textContent = delta.toString();
};

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

loop.start();