class TimeRuler {
  constructor(rulerDividerPanel, rulerTrack, scaleLimit) {
    this.rulerDividerPanel = rulerDividerPanel;
    this.rulerTrack = rulerTrack;
    this.scaleLimit = scaleLimit; // in minutes
    this.pixelsPerTick = 15; // gap between ticks
    this.minutesPerBigTick = 5; // every 5 minutes for big tick

    this.init();
  }

  init() {
    // Calculate total width needed
    const totalTicks = this.scaleLimit;
    const totalWidth = totalTicks * this.pixelsPerTick;

    this.rulerDividerPanel.style.width = `${totalWidth}px`; // Set ruler thumb width
    this.rulerTrack.style.width = `${totalWidth * 2}px`; // Set the ruler track width

    // Create ticks
    for (let i = 0; i <= this.scaleLimit; i++) {
      const position = i * this.pixelsPerTick;

      if (i % this.minutesPerBigTick === 0) {
        // Create big tick
        this.createTick(position, true, i);
      } else {
        // Create small tick
        this.createTick(position, false);
      }
    }
  }

  createTick(position, isBig, minutes = null) {
    const tick = document.createElement("div");
    tick.className = isBig ? "tick-big" : "tick-small";
    tick.style.left = `${position}px`;
    this.rulerDividerPanel.appendChild(tick);

    if (isBig && minutes !== null) {
      // Add label for big ticks
      const label = document.createElement("div");
      label.className = "tick-label";
      label.style.left = `${position}px`;
      label.textContent = minutes;
      this.rulerDividerPanel.appendChild(label);
    }
  }

  // updateTimeDisplay() {
  //   const display = document.getElementById("timeDisplay");
  //   display.textContent = this.formatTime(this.countDownTime);
  // }

  formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }
}

// Khởi tạo TimeRuler
document.addEventListener("DOMContentLoaded", () => {
  const rulerDividerPanel = document.querySelector(".ruler-divider-panel");
  const rulerTrack = document.querySelector(".ruler-track");
  const timeRuler = new TimeRuler(rulerDividerPanel, rulerTrack, 30); // 30 minutes scale
});
