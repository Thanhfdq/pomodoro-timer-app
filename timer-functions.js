// GET UI ELEMENTS
const modeButtons = document.querySelectorAll(".mode-buttons button");
const rulerDividerPanel = document.querySelector(".ruler-divider-panel");
const rulerThumb = document.querySelector(".ruler-thumb");
const rulerTrack = document.querySelector(".ruler-track");
const timeDisplay = document.getElementById("time-display");
const startPauseButton = document.getElementById("start-pause");
const timesUpSound = document.getElementById("times-up-sound");
const startStopSound = document.getElementById("start-stop-sound");

// DEFAULT SETTINGS VALUE
//time (minutes)
let pomodoroTime = 25;
let shortBreakTime = 0.5;
let longBreakTime = 15;
let longBreakInterval = 2; // Number of pomodoro before a long break
//auto
let auto_start_break = false;
let auto_start_pomodoro = false;

// CALCULATION VARIABLES
let timeInSeconds = pomodoroTime * 60; // Clock countdown the pomodoro first by default
let currentCountTime = pomodoroTime; // Save the duration of current mode to calculate the percent of circle
let interval;
let isRunning = false;
let currentMode = 0; // 0 is pomodoro, 1 is short break, and 2 is long break
let passedPomodoros = 0; // count the number of pomodoros have completed

startPauseButton.addEventListener("click", startTimer);
modeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    setActiveMode(this);

    switch (this.textContent) {
      case "Pomodoro":
        currentMode = 0;
        timeInSeconds = pomodoroTime * 60;
        break;
      case "Short Break":
        currentMode = 1;
        timeInSeconds = shortBreakTime * 60;
        break;
      case "Long Break":
        currentMode = 2;
        timeInSeconds = longBreakTime * 60;
        break;
    }
    checkAutoStartTimer();
    updateTimer();
  });
});
function updateModeButtons() {
  modeButtons.forEach((button) => {
    button.classList.remove("active");
    if (
      (currentMode === 0 && button.textContent === "Pomodoro") ||
      (currentMode === 1 && button.textContent === "Short Break") ||
      (currentMode === 2 && button.textContent === "Long Break")
    ) {
      button.classList.add("active");
    }
  });
}

// Khởi tạo TimeRuler
const timeRuler = new TimeRuler(
  rulerDividerPanel,
  rulerThumb,
  rulerTrack,
  pomodoroTime,
  40,
  5,
); // 30 minutes scale

// FUNCTIONS

// To start the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    updateButton();
    interval = setInterval(() => {
      timeInSeconds--;
      if (timeInSeconds == 0) {
        // end time block if time's up
        timesUpSound.play(); // Play a sound when time's up
        changeMode();
        checkAutoStartTimer();
        //reset new session after finished a long break and before start new pomodoro
        if (passedPomodoros == longBreakInterval && currentMode != 2) {
          passedPomodoros = 0;
        }
      }
      //update timer every second
      updateTimer();
    }, 1000);
  }
}
// To stop the timer
function stopTimer() {
  clearInterval(interval);
  isRunning = false;
  updateButton();
}

function checkAutoStartTimer() {
  if (currentMode == 0) {
    if (auto_start_pomodoro) {
      startTimer();
    } else {
      stopTimer();
    }
  } else {
    if (auto_start_break) {
      startTimer();
    } else {
      stopTimer();
    }
  }
}

// To update the timer display (every second)
function updateTimer() {
  updateDigitalTimer(timeInSeconds);
  timeRuler.updateRulerPosition();
}

// To update button functionality based on state
function updateButton() {
  startStopSound.pause();
  startStopSound.play();
  if (isRunning) {
    // Remove 'startTimer' and add 'stopTimer' as the event listener
    startPauseButton.removeEventListener("click", startTimer);
    startPauseButton.addEventListener("click", stopTimer);
    startPauseButton.innerHTML = "&#9208;"; //pause icon ⏸
  } else {
    // Remove 'stopTimer' and add 'startTimer' as the event listener
    startPauseButton.removeEventListener("click", stopTimer);
    startPauseButton.addEventListener("click", startTimer);
    startPauseButton.innerHTML = "&#9658;"; //play icon ▶
  }
}

function updateDigitalTimer(seconds) {
  timeDisplay.textContent = formatTime(getTimeComponents(seconds));
}

function formatTime({ hours, minutes, seconds }) {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getTimeComponents(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

// To determind the next mode is a break or a pomodoro
function changeMode() {
  if (currentMode == 0) {
    // after a pomodoro
    passedPomodoros++;
    if (passedPomodoros < longBreakInterval) {
      currentMode = 1;
      timeInSeconds = shortBreakTime * 60;
    } else {
      currentMode = 2;
      timeInSeconds = longBreakTime * 60;
    }
  } else {
    // after a break
    currentMode = 0;
    timeInSeconds = pomodoroTime * 60;
  }
  updateModeButtons();
}

function setActiveMode(clickedButton) {
  modeButtons.forEach((button) => {
    button.classList.remove("active");
  });
  clickedButton.classList.add("active");
}
