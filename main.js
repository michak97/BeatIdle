const loop = new GameLoop();

const kickDrum = new Howl({src:['static/sounds/BD.wav']});
const rimDrum = new Howl({src:['static/sounds/Rim.wav']});
const violin1 = new Howl({src:['static/sounds/violin1.wav'], loop:true})
const violin2 = new Howl({src:['static/sounds/violin2.wav'], loop:true})
const woodwind = new Howl({src:['static/sounds/woodwind.wav'], loop:true})

let violin1Playing = false;
let violin2Playing = false;
let woodwindPlaying = false;

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

let audioCtx = new AudioContext();

let oldStats = { ...stats}
let scoreTimer = 1;
let clickMultiplier = 1;
const BPM = 90
const singleBeatTime = 60000/BPM;
let beatTiming = 0;

let perfectStreak = 0;
let longestPerfectStreak = 0;

let clicked = false;

let building1 = 0;
let building1Cost = 100;
let building1Currency = 0.1;

let lastSingleBeatTime = 0;
let currency = 0;
let currency_per_millisecond = building1Currency*building1;

const BeatEl = document.querySelector('#beatTime');
const BPMEl = document.querySelector('#BPM');
const LSBTEl = document.querySelector('#lastSingleBeatTime');
const scoreTimerEl = document.querySelector('#scoreTimer');
const beatMultiplierEl = document.querySelector('#beatMultiplier');
const beatTimingEl = document.querySelector('#beatTime');
const scoreListEl = document.querySelector('#score-list');
const streakEl = document.querySelector('#score');
const clickMultiplierEl = document.querySelector('#clickMultiplier')

BPMEl.textContent = BPM.toString();

const currencyEl = document.querySelector('#currency');
const BeatButton = document.querySelector('#clicker');
const startButton = document.querySelector('#startButton');

startButton.addEventListener('click', () => {
  audioCtx.resume().then(()=>{
    loop.start();
  })
})

loop.onUpdate = function(dt, t) {
  currency += currency_per_millisecond * dt;
};

loop.onRender = function(i) {
  currencyEl.textContent = currency.toFixed(2);
  LSBTEl.textContent = lastSingleBeatTime.toFixed(2);
  BeatEl.textContent = singleBeatTime.toFixed(2);
  beatMultiplierEl.textContent = stats.beatMultiplier.toFixed(2);
  scoreTimerEl.textContent = scoreTimer.toFixed(2);
  beatTimingEl.textContent = beatTiming.toFixed(2);
  streakEl.textContent = perfectStreak.toFixed(2);
  clickMultiplierEl.textContent = clickMultiplier;
};

let pushScore = (element) =>{
	if(document.querySelectorAll('#score-list > li').length<5==true){
	scoreListEl.appendChild(element);
  }
  else{
  document.querySelectorAll('#score-list > li')[0].remove();
  scoreListEl.appendChild(element);
  }

}

let resetStreak = () => {if(perfectStreak>longestPerfectStreak){
  longestPerfectStreak=perfectStreak;
  }
  perfectStreak=0;
  violin1.stop();
  violin1Playing=false;
  violin2.stop();
  violin2Playing=false;
  woodwind.stop();
  woodwindPlaying=false;
}

startButton.addEventListener('click', () => {
  loop.start();
})

let beatAnimation = async () => {
  BeatButton.classList.add('beatClick');
  await new Promise(r => setTimeout(r, 300));
  BeatButton.classList.remove('beatClick');
}

let beatclick= () => {
    beatAnimation();
    if(clickMultiplier===1){
        kickDrum.play();
    }
    clicked = true;
    let li = document.createElement('li');
    switch(true){
  	    case stats.beatMultiplier > scoreTiers.perfect:
    	    li.classList.add("perfect");
    	    pushScore(li);
            stats.beatMultiplier=2.0;
            perfectStreak++;
            break;
        case stats.beatMultiplier > scoreTiers.great:
    	    li.classList.add("great");
            pushScore(li);
            stats.beatMultiplier=1.6;
            resetStreak();
            break;
   	    case stats.beatMultiplier > scoreTiers.good:
    	    li.classList.add("good");
            pushScore(li);
            stats.beatMultiplier=1.2;
            resetStreak();
            break;
        case stats.beatMultiplier > scoreTiers.okay:
            li.classList.add("okay");
            pushScore(li);
            stats.beatMultiplier=1.0;
            resetStreak();
            break;
  }
  currency+=stats.moneyPerClick*(stats.beatMultiplier*clickMultiplier);
  clickMultiplier = 0;

}

window.addEventListener("keydown", (event) => {
    console.log(event.which);
    if(event.key==" "||event.which==32){
        beatClick();
    }
    if(event.key=="q"||event.which==81){
        buyBuilding1();
    }
})

let buybuilding1 = () => {
    if(currency >= building1Cost){
        building1 += 1;
        currency -= building1Cost;
    }
}

BeatButton.addEventListener('click', () =>{
  beatclick();
})

loop.onPanic = function() {
  // discard any accumulated lag time and hope for the best
  this.timing.lag = 0;
};

$(document).on('visibilitychange', () => {
  violin1.stop();
  violin1Playing = false;
  violin2.stop();
  violin2Playing = false;
  woodwind.stop();
  woodwindPlaying = false;
})
