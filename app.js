// GET ELEMENTS
//header part 
let passedPomodoroBar = document.getElementById('passed-pomodoro');
let countPomodoroLabel = document.getElementById('count-pomodoro');
let longBreakIntervalLabel = document.getElementById('long-break-interval');
//tomato circle
let tomatoCircle = document.getElementById('tomato')
let mode = document.getElementById('mode');
let timerElement = document.getElementById('timer');
let startStopButton = document.getElementById('start-stop');
let resetButton = document.getElementById('reset');
//setting elements
let autoStart = document.getElementById('autostart');
let autoBreak = document.getElementById('autobreak');
//media elements
let notificationSound = document.getElementById('notification-sound');

// DEFAULT SETTINGS VALUE
//time
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let longBreakInterval = 2; // Number of pomodoro before a long break
//color
let pomodoroColor = 'rgb(255, 87, 87)';
let shortBreakColor = 'lightgray';
let longBreakColor = 'black';
//auto
let auto_start_break = true;
let auto_start_pomodoro = true;

// CALCULATION VARIABLES
let time = pomodoroTime; // Clock countdown the pomodoro first by default
let currentCountTime = pomodoroTime; // Save the duration of current mode to calculate the percent of circle
let interval;
let isRunning = false;
let currentMode = 0; // 0 is pomodoro, 1 is short break, and 2 is long break
let passedPomodoros = 0; // count the number of pomodoros have completed
let currentcolor = pomodoroColor;
let nextcolor = shortBreakColor;


// FUNCTIONS

// To update the timer display (every second)
function updateTimerDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    // Update colors display of tomato
    tomatoCircle.style.backgroundImage = `conic-gradient(${nextcolor} ${(currentCountTime - time) / currentCountTime * 100 * 3.6}deg, ${currentcolor} 0`
}

// To update new data status on screen (every time block)
function updateDataDisplay() {
    // update mode display
    mode.textContent = `${currentMode}` == 0 ? 'Pomodoro' : `${currentMode}` == 1 ? 'Short Break' : 'Long Break';
    setTomatoColor();
    // Update passed pomodoros
    countPomodoroLabel.textContent = `${passedPomodoros}`;
    // Update numbers of pomodoro progress bar
    passedPomodoroBar.style.width = 100 / longBreakInterval * passedPomodoros + '%';
}

// To start the timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        updateButton();
        interval = setInterval(() => {
            time--;
            if (time == 0) { // end time block if time's up
                notificationSound.play(); // Play a sound when time's up
                changeMode();
                //reset new session after finished a long break and before start new pomodoro
                if (passedPomodoros == longBreakInterval && currentMode != 2) {
                    passedPomodoros = 0;
                }
                updateDataDisplay();
            }
            //update timer every second
            updateTimerDisplay();
        }, 1000);
    }
}

// To stop the timer
function stopTimer() {
    clearInterval(interval);
    isRunning = false;
    updateButton();
}

// To reset the timer
function resetTimer() {
    isRunning = false;
    // reset all data
    clearInterval(interval);
    currentMode = 0; // Start Pomodoro by default
    time = pomodoroTime;
    passedPomodoros = 0;
    // update display
    countPomodoroLabel.textContent = `${passedPomodoros.toString}`;
    updateDataDisplay();
    updateTimerDisplay();
    updateButton();
}

// To determind the next mode is a break or a pomodoro
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

// To change the color of tomato circle (every time block)
function setTomatoColor() {
    if (currentMode == 0) {
        currentcolor = pomodoroColor;
        if (passedPomodoros == longBreakInterval - 1)
            nextcolor = longBreakColor;
        else
            nextcolor = shortBreakColor;
    } else if (currentMode == 1) {
        currentcolor = shortBreakColor;
        nextcolor = pomodoroColor;
    } else {
        currentcolor = longBreakColor;
        nextcolor = pomodoroColor;
    }
}

// To update button functionality based on state
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
// To show default value at begin of program
function showSettingData(){
    longBreakIntervalLabel.textContent = `${longBreakInterval}`
}

// START PROGRAM CALLED
showSettingData();
resetTimer();
updateButton();

// EVENT LISTENER FOR BUTTONS
startStopButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);