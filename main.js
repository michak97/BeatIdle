function loadTime(){
  const time = window.localStorage.getItem("total_time");
  if (time) return parseFloat(time);
  return 0;
}

function saveTime(time){
  window.localStorage.setItem("total_time", time);
}

let last_time=null;
let total_time=loadTime();

window.addEventListener("beforeunload", () => saveTime(total_time));

setInterval(function gameLoop() {
  const current_time = performance.now();

  if (last_time === null){
    last_time = current_time;
  }

  const delta_time = current_time - last_time;
  total_time += delta_time;
  last_time = current_time;

  updateGame(delta_time, total_time)
}, 1000/60);

let building_a_currency_per_millisecond = 0.001;
let building_b_currency_per_millisecond = 0.003;

let currency = (building_a_currency_per_millisecond * total_time) + (building_b_currency_per_millisecond * total_time);

let last_save = 0;

function updateGame(delta_time, total_time){
  if (total_time-last_save >= 5000){
    saveTime(total_time);
    last_save=total_time;
  }
  currency += (building_a_currency_per_millisecond) * delta_time;
  currency += (building_b_currency_per_millisecond) * delta_time;
  currency_display = document.querySelector('#currency');

  currency_display.textContent = currency.toFixed(2);
}