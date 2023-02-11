const loop = new GameLoop();

const stats = {
  money: 0,
  moneyPerClick: 1,
  scoreMultiplier: 1,
  beatMultiplier: 0,
}

const scoreTiers = {
	perfect: 0.9,
  great: 0.75,
  good: 0.5,
  okay: 0.3
}

let oldStats = { ...stats}
let scoreTimer = 1;
let clickMultiplier = 1;
const BPM = 90
const singleBeatTime = 60000/BPM;
let beatTiming = 0;

let perfectStreak = 0;
let longestPerfectStreak = 0;

let clicked = false;

let lastSingleBeatTime = 0;
let currency = 0;
let currency_per_millisecond = 0;

const BeatEl = document.querySelector('#beatTime');
const BPMEl = document.querySelector('#BPM');
const LSBTEl = document.querySelector('#lastSingleBeatTime');
const beatMultiplierEl = document.querySelector('#beatMultiplier');
const beatTimingEl = document.querySelector('#beatTime');
const scoreListEl = document.querySelector('#score-list');
const streakEl = document.querySelector('#score');

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
  streakEl.textContent = perfectStreak.toFixed(2);
};

let resetStreak = () => {if(perfectStreak>longestPerfectStreak){
longestPerfectStreak=perfectStreak;
}
perfectStreak=0;
}

BeatButton.addEventListener('click', () =>{
  loop.start();
	clicked = true;
  let li = document.createElement('li');
  switch(true){
  	case stats.beatMultiplier > scoreTiers.perfect:
    	li.textContent = "perfect";
    	scoreListEl.appendChild(li);
      stats.beatMultiplier=2.0;
      perfectStreak++;
      break;
    case stats.beatMultiplier > scoreTiers.great:
    	li.textContent = "great";
      scoreListEl.appendChild(li);
      stats.beatMultiplier=1.6;
      perfectStreak=0;
      break;
   	case stats.beatMultiplier > scoreTiers.good:
    	li.textContent = "good";
      scoreListEl.appendChild(li);
      stats.beatMultiplier=1.2;
      perfectStreak=0;
      break;
    case stats.beatMultiplier > scoreTiers.okay:
    	li.textContent = "okay";
      scoreListEl.appendChild(li);
      stats.beatMultiplier=1.0;
      perfectStreak=0;
      break;
  }
  currency+=stats.moneyPerClick*(stats.beatMultiplier*clickMultiplier);
  clickMultiplier = 0;
})

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

