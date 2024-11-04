class TimeRuler {
  constructor(
    rulerDividerPanel,
    rulerThumb,
    rulerTrack,
    scaleLimit,
    pixelsPerTick,
    pixelPerBigTick,
  ) {
    this.rulerDividerPanel = rulerDividerPanel;
    this.rulerThumb = rulerThumb;
    this.rulerTrack = rulerTrack;
    this.scaleLimit = scaleLimit; // in minutes
    this.pixelsPerTick = pixelsPerTick; // gap between ticks
    this.minutesPerBigTick = pixelPerBigTick; // every 5 minutes for big tick

    // Initialize properties
    this.isDragging = false;
    this.velocity = 0;
    this.lastPosition = 0;
    this.momentumInterval = null;
    this.lastMoveTime = 0;
    this.thumbRect = null;
    this.mouseOnThumb = null;

    // Bind methods to this instance
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.applyMomentum = this.applyMomentum.bind(this);

    // Set up event listener
    this.rulerThumb.addEventListener("mousedown", this.onMouseDown);

    this.init();
  }

  init() {
    // Calculate total width needed
    const totalTicks = this.scaleLimit;
    const totalWidth = totalTicks * this.pixelsPerTick;

    this.rulerDividerPanel.style.width = `${totalWidth}px`; // Set ruler thumb width
    this.rulerTrack.style.minWidth = `${totalWidth * 2 + 300}px`; // Set the ruler track width

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

  onMouseDown(e) {
    this.isDragging = true;
    this.thumbRect = rulerThumb.getBoundingClientRect();
    this.mouseOnThumb = e.clientX - this.thumbRect.left;
    this.lastPosition = e.clientX;
    this.lastMoveTime = Date.now(); // Record the time dragging starts

    // Add event listeners for dragging
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);

    // Stop any ongoing momentum effect when dragging starts
    clearInterval(this.momentumInterval);
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    const trackRect = this.rulerTrack.getBoundingClientRect();

    let newLeft = e.clientX - trackRect.left - this.mouseOnThumb;

    // Ensure the thumb stays within the track
    if (newLeft < 0) newLeft = 0;
    if (newLeft > trackRect.width - this.rulerThumb.offsetWidth) {
      newLeft = trackRect.width - this.rulerThumb.offsetWidth;
    }

    // Calculate velocity (current position - last position)
    this.velocity = e.clientX - this.lastPosition;
    this.lastPosition = e.clientX;
    this.lastMoveTime = Date.now(); // Update last move time

    // Move the ruler
    rulerThumb.style.left = `${this.snapToInterval(newLeft)}px`;
    // Set the time base on the thumb's position
    time = this.scaleLimit - Math.round(newLeft / this.pixelsPerTick);
    updateDigitalTimer(time);
  }

  onMouseUp() {
    this.isDragging = false;
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);

    // Check if thumb was stationary just before mouse up
    const timeSinceLastMove = Date.now() - this.lastMoveTime;
    if (timeSinceLastMove > 50 || Math.abs(this.velocity) < 1) {
      // If stationary for a significant amount of time or velocity is very low
      this.velocity = 0; // Set velocity to zero to prevent momentum
    }

    // Apply momentum if there is any velocity
    if (this.velocity !== 0) {
      this.applyMomentum();
    }
  }

  snapToInterval(position) {
    return Math.round(position / this.pixelsPerTick) * this.pixelsPerTick;
  }

  applyMomentum() {
    this.momentumInterval = setInterval(() => {
      // Dampen the velocity over time to simulate friction
      this.velocity *= 0.9;

      // Update the thumb's position based on the current velocity
      const currentLeft = parseFloat(this.rulerThumb.style.left) || 0;
      const newLeft = Math.round(currentLeft + this.velocity);

      // Ensure the thumb stays within the track
      const trackRect = this.rulerTrack.getBoundingClientRect();
      const maxLeft = trackRect.width - this.rulerThumb.offsetWidth;
      if (newLeft < 0) {
        rulerThumb.style.left = "0px";
        clearInterval(this.momentumInterval);
        return;
      }
      if (newLeft > maxLeft) {
        this.rulerThumb.style.left = `${maxLeft}px`;
        clearInterval(this.momentumInterval);
        return;
      }

      // Move the ruler
      this.rulerThumb.style.left = `${this.snapToInterval(newLeft)}px`;
      // Set the time base on the thumb's position
      time = this.scaleLimit - Math.round(newLeft / this.pixelsPerTick);
      updateDigitalTimer(time);

      // Stop the interval if the velocity is very low (thumb is nearly stationary)
      if (Math.abs(this.velocity) < 0.5) {
        clearInterval(this.momentumInterval);
      }
    }, 16); // Update every ~16ms (60 frames per second)
  }

  countDown() {
    const currentLeft = parseFloat(this.rulerThumb.style.left) || 0;
    const newLeft = currentLeft + this.pixelsPerTick / 60;
    this.rulerThumb.style.left = `${newLeft}px`;
    console.log(newLeft);
  }
}
