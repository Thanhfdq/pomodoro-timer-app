let timerElement = document.getElementById('timer');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let resetButton = document.getElementById('reset');
let notificationSound = document.getElementById('notification-sound');

// Set time
let POMODORO_DURATION = 5;
let SHORT_BREAK = 2;
let LONG_BREAK = 15;
let LONG_BREAK_INTERVAL = 4; // Number of pomodoro before a long break

// Setting: auto start
let auto_start_break = true;
let auto_start_pomodoro = true;

let time = POMODORO_DURATION;
let interval;
let isRunning = false;

// Function to update the timer display
function updateTimerDisplay(){
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to start the timer
function startTimer(){
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(() => {
            if (time > 0){
                time--;
                updateTimerDisplay();
            }else{
                notificationSound.play(); // Play a sound when time's up
                resetTimer();
            }
        }, 1000);
    }
}

// Function to stop the timer
function stopTimer() {
    clearInterval(interval);
    isRunning = false;
}

// Function to reset the timer
function resetTimer(){
    clearInterval(interval);
    time = POMODORO_DURATION; // Reset it to 25 minutes
    updateTimerDisplay();
    isRunning = false;
}

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click',resetTimer);