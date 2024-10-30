class TimeRuler {
  constructor(container, scaleLimit) {
    this.container = container;
    this.scaleLimit = scaleLimit; // in minutes
    this.pixelsPerTick = 15; // gap between ticks
    this.minutesPerBigTick = 5; // every 5 minutes for big tick

    this.init();
  }

  init() {
    // Calculate total width needed
    const totalTicks = this.scaleLimit;
    const totalWidth = totalTicks * this.pixelsPerTick;

    // Set ruler width
    this.container.style.width = `${totalWidth}px`;

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
    this.container.appendChild(tick);

    if (isBig && minutes !== null) {
      // Add label for big ticks
      const label = document.createElement("div");
      label.className = "tick-label";
      label.style.left = `${position}px`;
      label.textContent = minutes;
      this.container.appendChild(label);
    }
  }
}

const rulerContainer = document.querySelector(".ruler");
const timeRuler = new TimeRuler(rulerContainer, 30); // 30 minutes scale
