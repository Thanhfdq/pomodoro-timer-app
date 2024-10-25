let timerElement = document.getElementById('timer');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let resetButton = document.getElementById('reset');
let notificationSound = document.getElementById('notification-sound');

let mode = document.getElementById('mode');
let countPomodoro = document.getElementById('countpomodoro');
let longBreakInterval = document.getElementById('longbreakinterval');
let autoStart = document.getElementById('autostart');
let autoBreak = document.getElementById('autobreak');

// Set time
let POMODORO_DURATION = 25;
let SHORT_BREAK = 5;
let LONG_BREAK = 15;
let LONG_BREAK_INTERVAL = 4; // Number of pomodoro before a long break

// Setting: auto start
let auto_start_break = true;
let auto_start_pomodoro = true;

let time = POMODORO_DURATION; // Clock countdown the pomodoro first by default
let interval;
let isRunning = false;
let currentMode = 0; // 0 is pomodoro, 1 is short break, and 2 is long break
let pomodoroBeforeLongBreak = LONG_BREAK_INTERVAL // count the number of pomodoro done before

// Function to update the timer display
function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTimeStatus(){
    mode.textContent = `${currentMode.toString()}`;
    countPomodoro.textContent = `${pomodoroBeforeLongBreak.toString()}`;
    longBreakInterval.textContent = `${LONG_BREAK_INTERVAL.toString()}`;
    autoStart.textContent = `${auto_start_pomodoro.toString()}`;
    autoBreak.textContent = `${auto_start_break.toString()}`;
}

// Function to start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        interval = setInterval(() => {
            if (time > 0) { // countinous countdown
                time--;
                updateTimerDisplay();
            } else { // end time block
                notificationSound.play(); // Play a sound when time's up
                nextMode();
                updateTimeStatus();
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
function resetTimer() {
    clearInterval(interval);
    currentMode = 0;
    time = POMODORO_DURATION; // Reset it to 25 minutes
    updateTimerDisplay();
    //reset all event
    pomodoroBeforeLongBreak = LONG_BREAK_INTERVAL;
    updateTimeStatus();
    isRunning = false;
}

// Function to determind the next mode is a break or a pomodoro
function nextMode() {
    if (currentMode == 0) { // after a pomodoro
        pomodoroBeforeLongBreak--;
        if (pomodoroBeforeLongBreak > 0) {
            currentMode = 1;
            time = SHORT_BREAK;
        } else {
            currentMode = 2;
            time = LONG_BREAK;
            //reset new session
            pomodoroBeforeLongBreak = LONG_BREAK_INTERVAL;
        }
        if (auto_start_break) {
            startTimer();
        }
    } else { // after a break
        currentMode = 0;
        time = POMODORO_DURATION;
        if (auto_start_pomodoro) {
            updateTimeStatus();
            startTimer();
        }
    }
}

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);