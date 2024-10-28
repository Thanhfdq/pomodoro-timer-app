let timerElement = document.getElementById('timer');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let startStopButton = document.getElementById('start-stop');
let resetButton = document.getElementById('reset');
let notificationSound = document.getElementById('notification-sound');
let passedPomodoroBar = document.getElementById('passed-pomodoro');
let tomatoCircle = document.getElementById('tomato')

let mode = document.getElementById('mode');
let countPomodoroLabel = document.getElementById('count-pomodoro');
let longBreakIntervalLabel = document.getElementById('long-break-interval');
let autoStart = document.getElementById('autostart');
let autoBreak = document.getElementById('autobreak');

// Set time
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let longBreakInterval = 2; // Number of pomodoro before a long break
// Color
const POMODORO_COLOR = 'rgb(255, 87, 87)';
const SHORT_BREAK_COLOR = 'lightgray';
const LONG_BREAK_COLOR = 'black';

// Setting: auto start
let auto_start_break = true;
let auto_start_pomodoro = true;

let time = pomodoroTime; // Clock countdown the pomodoro first by default
let currentCountTime = pomodoroTime; // Save the duration of current mode to calculate the percent of circle
let interval;
let isRunning = false;
let currentMode = 0; // 0 is pomodoro, 1 is short break, and 2 is long break
let passedPomodoros = 0; // count the number of pomodoros have completed

// set the start color of the tomato
let currentcolor = POMODORO_COLOR;
let nextcolor = SHORT_BREAK_COLOR;


// Function to update the timer display
function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    tomatoCircle.style.backgroundImage = `conic-gradient(${nextcolor} ${(currentCountTime - time) / currentCountTime * 100 * 3.6}deg, ${currentcolor} 0`
}

function updateTimeStatus() {
    mode.textContent = `${currentMode}` == 0 ? 'Pomodoro' : `${currentMode}` == 1 ? 'Short Break' : 'Long Break';
    setTomatoColor();
    updateTimerDisplay();
    countPomodoroLabel.textContent = `${passedPomodoros}`;
    passedPomodoroBar.style.width = 100 / longBreakInterval * passedPomodoros + '%';
    // autoStart.textContent = `${auto_start_pomodoro.toString()}`;
    // autoBreak.textContent = `${auto_start_break.toString()}`;
}

// Function to start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        updateButton();
        interval = setInterval(() => {
            time--;
            if (time > 0) { // countinous countdown
                updateTimerDisplay();
            } else { // end time block
                notificationSound.play(); // Play a sound when time's up
                changeMode();
                //reset new session after a long break
                if (passedPomodoros == longBreakInterval && currentMode != 2) {
                    passedPomodoros = 0;
                }
                updateTimeStatus();
            }
        }, 1000);
    }
}

// Function to stop the timer
function stopTimer() {
    clearInterval(interval);
    isRunning = false;
    updateButton();
}

// Function to reset the timer
function resetTimer() {
    isRunning = false;
    clearInterval(interval);
    countPomodoroLabel.textContent = `${passedPomodoros.toString}`;
    longBreakIntervalLabel.textContent = `${longBreakInterval}`;
    currentMode = 0;
    time = pomodoroTime; // Reset it to default time
    //reset all event
    passedPomodoros = 0;
    updateTimeStatus();
    updateButton();
}

// Function to determind the next mode is a break or a pomodoro
function changeMode() {
    if (currentMode == 0) { // after a pomodoro
        passedPomodoros++;
        if (passedPomodoros < longBreakInterval) {
            currentMode = 1;
            time = shortBreakTime;
            currentCountTime = shortBreakTime;
        } else {
            currentMode = 2;
            time = longBreakTime;
            currentCountTime = longBreakTime;
        }
        if (auto_start_break) {
            startTimer();
        }
    } else { // after a break
        currentMode = 0;
        time = pomodoroTime;
        currentCountTime = pomodoroTime
        if (auto_start_pomodoro) {
            startTimer();
        }
    }
}

function setTomatoColor() {
    if (currentMode == 0) {
        currentcolor = POMODORO_COLOR;
        if (passedPomodoros == longBreakInterval - 1)
            nextcolor = LONG_BREAK_COLOR;
        else
            nextcolor = SHORT_BREAK_COLOR;
    } else if (currentMode == 1) {
        currentcolor = SHORT_BREAK_COLOR;
        nextcolor = POMODORO_COLOR;
    } else {
        currentcolor = LONG_BREAK_COLOR;
        nextcolor = POMODORO_COLOR;
    }
}

// Function to update button functionality based on state
function updateButton() {
    if (isRunning) {
        // Remove 'startTimer' and add 'stopTimer' as the event listener
        startStopButton.removeEventListener("click", startTimer);
        startStopButton.addEventListener("click", stopTimer);
        startStopButton.textContent = "Stop";
    } else {
        // Remove 'stopTimer' and add 'startTimer' as the event listener
        startStopButton.removeEventListener("click", stopTimer);
        startStopButton.addEventListener("click", startTimer);
        startStopButton.textContent = "Start";
    }
}
// Initial setup to start with "Start" functionality
resetTimer();
updateButton();

// Event listeners for buttons
startStopButton.addEventListener('click', startTimer);
// startButton.addEventListener('click', startTimer);
// stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);