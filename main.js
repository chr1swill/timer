(function () {
	class TimerController {
		/**
		 * @type{number}
		 */
		expected = 0;

		/**
		 * @type{number}
		 */
		timeout = 0;

		#timeToCountDownFrom = 0;

		/**
		 * @type{number}
		 */
		#interval = 1000;

		/**
		 * @type{boolean}
		 */
		#isTimerRunning = false;

		/**
		 * @param{HTMLParagraphElement|null} timerDisplay
		 * @param{HTMLInputElement|null} timeSelectorMins
		 * @param{HTMLInputElement|null} timeSelectorSecs
		 */
		constructor(timerDisplay, timeSelectorMins, timeSelectorSecs) {
			this.step = this.#step.bind(this);
			if (
				timerDisplay === null ||
				timeSelectorMins === null ||
				timeSelectorSecs === null
			) {
				throw ReferenceError(
					"Could not set up TimeController, an attempt to access ui element return a null value",
				);
			}
			this.timerDisplay = /**@type{HTMLParagraphElement}*/ (timerDisplay);
			this.selectMins = /**@type{HTMLInputElement}*/ (timeSelectorMins);
			this.selectSecs = /**@type{HTMLInputElement}*/ (timeSelectorSecs);
		}

		start() {
			if (this.#isTimerRunning === true) {
				console.error(
					"You can not start a new timer, a timer is currently running",
				);
				return;
			}
			const now = Date.now();
			this.expected = now + this.#interval;
			this.timeout = window.setTimeout(() => this.step(), this.#interval);
			this.#isTimerRunning = true;
			const startTimerInSeconds = this.convertTimeToSeconds();
			if (startTimerInSeconds === null) {
				console.error("Could not update Wall Time");
				return null;
			}
			this.#timeToCountDownFrom = startTimerInSeconds;
		}

		stop() {
			window.clearTimeout(this.timeout);
			this.#isTimerRunning = false;
		}

		#step() {
			if (this.#timeToCountDownFrom <= 0) {
				console.log("Timer completed");
				this.stop();
				this.#isTimerRunning = false;
				this.#timeToCountDownFrom = 0;
				this.timerDisplay.textContent = this.#timeToCountDownFrom.toString();
			}
			const now = Date.now();
			// positive drift mean clock is slow
			// 0 drfit is amazing
			// negative drift mean clock is fast
			const driftInMs = now - this.expected;
			console.log("drift: ", driftInMs);
			console.log("interval: ", this.#interval);
			if (driftInMs - this.#interval !== 0) {
				this.#correctDrift(driftInMs);
				return;
			}
			this.#deincrement();
			this.expected += this.#interval;
			this.timeout = window.setTimeout(this.step, Math.max(0, this.#interval));
			if (this.#timeToCountDownFrom === 0) {
				this.stop();
				return;
			}
		}

		#deincrement() {
			this.#timeToCountDownFrom--;
			console.log("Fired with value: ", this.#timeToCountDownFrom);
			this.timerDisplay.textContent = this.#timeToCountDownFrom.toString();
		}

		/**
		 * @param{number} driftInMs
		 */
		#correctDrift(driftInMs) {
			this.#timeToCountDownFrom--;
			this.timerDisplay.textContent = this.#timeToCountDownFrom.toString();
			console.warn("The drift exceeded the interval, drift: ", driftInMs, "ms");
			this.#interval = this.#interval - driftInMs;
			clearTimeout(this.timeout);
			this.timeout = window.setTimeout(this.step, Math.max(0, this.#interval));
			console.log("new interval: ", this.#interval);
		}

		getWallTime() {
			return this.#timeToCountDownFrom;
		}

		resetWallTime() {
			this.#timeToCountDownFrom;
		}

		timerRunning() {
			return this.#isTimerRunning;
		}

		/**
		 * @returns{number|null}
		 */
		convertTimeToSeconds() {
			if (this.selectMins === null || this.selectSecs === null) {
				console.error(
					"Could not parse inputs values, one or both do not exist",
				);
				return null;
			}
			return this.selectMins.valueAsNumber * 60 + this.selectSecs.valueAsNumber;
		}
	}

	const timeSelectorMins = /**@type{HTMLInputElement|null}*/ (
		document.querySelector("[data-time-selector-mins='0']")
	);
	const timeSelectorSecs = /**@type{HTMLInputElement|null}*/ (
		document.querySelector("[data-time-selector-secs='0']")
	);
	const startButton = /**@type{HTMLButtonElement|null}*/ (
		document.querySelector("[data-start-timer='0']")
	);
	const pauseButton = /**@type{HTMLButtonElement|null}*/ (
		document.querySelector("[data-pause-timer='0']")
	);
	const stopButton = /**@type{HTMLButtonElement|null}*/ (
		document.querySelector("[data-stop-timer='0']")
	);
	const displayTime = /**@type{HTMLParagraphElement|null}*/ (
		document.querySelector("[data-display-time='0']")
	);

	if (
		timeSelectorMins === null ||
		timeSelectorSecs === null ||
		startButton === null ||
		pauseButton === null ||
		stopButton === null ||
		displayTime === null
	) {
		console.error("Could not find the ui control elements needed");
		console.error(`timeSelectorMins was found: ${timeSelectorMins}`);
		console.error(`timeSelectorSecs was found: ${timeSelectorSecs}`);
		console.error(`startButton was found: ${startButton}`);
		console.error(`pauseButton was found: ${pauseButton}`);
		console.error(`stopButton was found: ${stopButton}`);
		console.error(`displayTime was found: ${displayTime}`);
		return;
	}

	/**@type{TimerController}*/
	const ticker = new TimerController(
		displayTime,
		timeSelectorMins,
		timeSelectorSecs,
	);

	startButton.onclick = function () {
		if (ticker.timerRunning() === true) {
			console.log(
				"A timer is currently running, if you would like to start a new now stop the only one first",
			);
			return;
		}

		if (
			timeSelectorMins.valueAsNumber === 0 &&
			timeSelectorSecs.valueAsNumber === 0
		) {
			console.log(
				"Please select a duration of timer longer then 0mins 0secs, no timer started",
			);
			return;
		}

		const startTimeInSeconds = ticker.updateWallTime();

		if (startTimeInSeconds === null) {
			console.error(
				"An error occured while attempting to convert inputed values to seconds",
			);
			return;
		}

		if (
			displayTime.textContent !== null &&
			parseInt(displayTime.textContent) > 0 &&
			!isNaN(parseInt(displayTime.textContent)) &&
			displayTime.textContent.trim() !== ""
		) {
			ticker.start();
			return;
		}

		if (
			displayTime.textContent === "0" ||
			displayTime.textContent === null ||
			displayTime.textContent.trim() === ""
		) {
			ticker.timerDisplay.textContent = startTimeInSeconds.toString();
			ticker.start();
		} else if (!isNaN(parseInt(displayTime.textContent))) {
			const wallTime = ticker.updateWallTime();
			if (wallTime === null) {
				console.error("An error occured while updated the wall time");
				return;
			}

			ticker.start();
		} else {
			console.error(
				"Why displayTime not a number rn, value: ",
				displayTime.textContent,
			);
			return;
		}
	};

	pauseButton.onclick = function () {
		if (
			timeSelectorMins.valueAsNumber === 0 &&
			timeSelectorSecs.valueAsNumber === 0
		) {
			console.log(
				"Please select a duration of timer longer then 0mins 0secs, no timer started",
			);
			return;
		}

		if (ticker.timerRunning() === true) {
			ticker.stop();
		} else {
			ticker.start();
		}
	};

	stopButton.onclick = function () {
		if (ticker.timerRunning() === false) return;
		ticker.stop();
		displayTime.textContent = "0";
		ticker.resetWallTime();
	};
})();
