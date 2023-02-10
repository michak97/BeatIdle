const loop = new GameLoop();

const stats = {
  money: 0,
  moneyPerClick: 1,
  scoreMultiplier: 1,
  beatMultiplier: 0,
}

let oldStats = { ...stats}

const BPM = 90;
const singleBeatTime = 60000/BPM;
let beatTiming = 0;

let lastSingleBeatTime = 0;
let currency = 0;
let currency_per_millisecond = 0;

const BeatEl = document.querySelector('#beatTime');
const BPMEl = document.querySelector('#BPM');
const LSBTEl = document.querySelector('#lastSingleBeatTime');
const beatMultiplierEl = document.querySelector('#beatMultiplier');
const beatTimingEl = document.querySelector('#beatTime');

BPMEl.textContent = BPM.toString();

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
  beatMultiplierEl.textContent = stats.beatMultiplier.toFixed(2);
  beatTimingEl.textContent = beatTiming.toFixed(2);
};

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

loop.start();