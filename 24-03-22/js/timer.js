// const timerHours = document.getElementById('timerHours');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');

const timerSelector = document.getElementById('timerSelector')

const timerDisplay = document.getElementById('timerDisplay');
const timerButton = document.getElementById('timerButton');
const timerPause = document.getElementById('timerPause');

let timerIsPaused = false;
let timerIsRunning = false;

function handlePause(){
    if (timerIsPaused) {
        timerPause.innerHTML = 'Resume';
    } else{
        timerPause.innerHTML = 'Pause';
    }
}

function showCountdown(visible = true){
    if (visible) {
        timerSelector.style.display = 'none';
        timerDisplay.style.display = 'block';
    }else{
        timerSelector.style.display = 'block';
        timerDisplay.style.display = 'none';
    }
}

audio_volume = 0.2;
music_volume = 0.4;
let click = new Audio('./assets/audio/click_stereo.ogg');
click.volume = audio_volume;

let timer_alarm = new Audio('./assets/audio/Countdown.ogg')
timer_alarm.volume = music_volume;

// timerHours.value = '00';
timerMinutes.value = '05';
timerSeconds.value = '00';

function startTimer(duration) {
    var timer = duration, minutes, seconds;

    let timerTick = setInterval(function(){
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        let timerText = ''
        if (seconds < 0 || minutes < 0) {timerText += '-'}
        timerText += `${Math.abs(minutes)}:${Math.abs(seconds)}`
        
        if (!timerIsPaused && timerIsRunning){
            timerDisplay.innerHTML = timerText;
            timer = --timer;
        }
        if (timer < 0 && timer_alarm.paused && timerIsRunning) {
            if (!document.hasFocus()){
                const n = new Notification("Timer has expired.");
            }
            timer_alarm.play();
        }
        if (!timerIsRunning) {
            timer = 0;
            
            clearInterval(timerTick);
        }
    }, 1000);
}
showCountdown(false);
timerPause.disabled = true;

timerButton.addEventListener("click", function(e) {
    click.play();
    let seconds = 0;
    // seconds += Number(timerHours.value) * 60 * 60;
    seconds += Number(timerMinutes.value) * 60;
    seconds += Number(timerSeconds.value);
    if (seconds != 0 && !timerIsRunning) {
        timerDisplay.innerHTML = `${timerMinutes.value}:${timerSeconds.value}`
        showCountdown(true);
        timerPause.disabled = false;
        timerIsPaused = false; handlePause();
        timerIsRunning = true;
        timerButton.innerHTML = 'Reset';
        startTimer(seconds-1);
        
    } else{
        showCountdown(false);
        timer_alarm.pause();
        timer_alarm.currentTime = 0;
        timerPause.disabled = true;
        timerIsPaused = false; handlePause();
        timerIsRunning = false;
        timerButton.innerHTML = 'Start';
        
    }
}, false);

timerPause.addEventListener("click", function(e){ 
    click.play();
    timerIsPaused = !timerIsPaused; handlePause(); 
}, false)


