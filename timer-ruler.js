class TimeRuler {
  constructor(container, scaleLimit) {
    this.container = container;
    this.ruler = container.querySelector(".ruler");
    this.scaleLimit = scaleLimit; // in minutes
    this.pixelsPerTick = 15; // gap between ticks
    this.minutesPerBigTick = 5; // every 5 minutes for big tick

    // Drag related properties
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.countDownTime = 0; // In minutes

    this.init();
    this.setupDragHandlers();
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
  setupDragHandlers() {
    // Mouse Events
    this.container.addEventListener("mousedown", (e) => this.startDragging(e));
    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", () => this.stopDragging());

    // Touch Events
    this.container.addEventListener("touchstart", (e) => this.startDragging(e));
    document.addEventListener("touchmove", (e) => this.drag(e));
    document.addEventListener("touchend", () => this.stopDragging());

    // Prevent default scroll behavior
    this.container.addEventListener("scroll", () => {
      this.updateCountDownTime();
    });
  }

  startDragging(e) {
    this.isDragging = true;
    this.container.style.cursor = "grabbing";

    // Get initial position
    if (e.type === "mousedown") {
      this.startX = e.pageX - this.container.offsetLeft;
    } else {
      this.startX = e.touches[0].pageX - this.container.offsetLeft;
    }

    this.scrollLeft = this.container.scrollLeft;
  }

  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    // Calculate cursor position
    let x;
    if (e.type === "mousemove") {
      x = e.pageX - this.container.offsetLeft;
    } else {
      x = e.touches[0].pageX - this.container.offsetLeft;
    }

    // Calculate scroll amount
    const walk = x - this.startX;
    this.container.scrollLeft = this.scrollLeft - walk;

    this.updateCountDownTime();
  }

  stopDragging() {
    this.isDragging = false;
    this.container.style.cursor = "grab";
  }

  updateCountDownTime() {
    // Calculate time based on scroll position
    const scrollPosition = this.container.scrollLeft;
    this.countDownTime = Math.round(scrollPosition / this.pixelsPerTick);

    // Update display
    this.updateTimeDisplay();

    // Dispatch custom event
    const event = new CustomEvent("timechange", {
      detail: { time: this.countDownTime },
    });
    this.container.dispatchEvent(event);
  }

  updateTimeDisplay() {
    const display = document.getElementById("timeDisplay");
    display.textContent = this.formatTime(this.countDownTime);
  }

  formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  // Method to programmatically set time
  setTime(minutes) {
    const scrollPosition = minutes * this.pixelsPerTick;
    this.container.scrollLeft = scrollPosition;
    this.updateCountDownTime();
  }
}

const rulerContainer = document.querySelector(".ruler");
const timeRuler = new TimeRuler(rulerContainer, 70); // 30 minutes scale
// Listen for time changes
rulerContainer.addEventListener("timechange", (e) => {
  console.log("Time changed:", e.detail.time);
  // You can update your countDownTime variable here
  const countDownTime = e.detail.time;
});
