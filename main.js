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

		/**
		 * @type{number}
		 */
		interval = 0;

		/**
		 * @type{boolean}
		 */
		#isTimerRunning = false;

		/**
		 * @param{Function} workFunc
		 * @param{number} interval
		 * @param{Function} errorFunc
		 */
		constructor(workFunc, interval, errorFunc) {
			this.workFunc = workFunc;
			this.interval = interval;
			this.errorFunc = errorFunc;
			this.step = this.#step.bind(this);
		}

		start() {
			if (this.#isTimerRunning === true) {
				console.error(
					"You can not start a new timer, a timer is currently running",
				);
				return;
			}
			const now = Date.now();
			this.expected = now + this.interval;
			this.timeout = window.setTimeout(() => this.step(), this.interval);
			this.#isTimerRunning = true;
		}

		stop() {
			window.clearTimeout(this.timeout);
			this.#isTimerRunning = false;
		}

		#step() {
			const now = Date.now();
			const drift = this.expected - now;
			if (drift > this.interval) {
				if (this.errorFunc) this.errorFunc();
			}
			this.workFunc();
			this.expected += this.interval;
			this.timeout = window.setTimeout(this.step, Math.max(0, this.interval));
			if (timeToCountDownFrom === 0) {
				this.#reset();
				return;
			}
		}

		timerRunning() {
			return this.#isTimerRunning;
		}

		#reset() {
			this.stop();
			this.expected = 0;
			this.interval = 0;
		}
	}

	const timeSelector = /**@type{HTMLInputElement|null}*/ (
		document.getElementById("selectTime")
	);
	const startButton = /**@type{HTMLButtonElement|null}*/ (
		document.getElementById("startTimer")
	);
	const pauseButton = /**@type{HTMLButtonElement|null}*/ (
		document.getElementById("pauseTimer")
	);
	const stopButton = /**@type{HTMLButtonElement|null}*/ (
		document.getElementById("stopTimer")
	);
	const displayTime = /**@type{HTMLParagraphElement|null}*/ (
		document.getElementById("displayTime")
	);

	if (
		timeSelector === null ||
		startButton === null ||
		pauseButton === null ||
		stopButton === null ||
		displayTime === null
	) {
		console.error("Could not find the ui control elements needed");
		return;
	}

	/**@type{number}*/
	let timeToCountDownFrom;

	const doWork = function () {
		timeToCountDownFrom--;
		console.log("Fired with value: ", timeToCountDownFrom);
		displayTime.textContent = timeToCountDownFrom.toString();
	};

	const doError = function () {
		console.warn("The drift exceeded the interval.");
	};

	/**@type{TimerController|undefined}*/
	let ticker = new TimerController(doWork, 1000, doError);

	startButton.onclick = function () {
		if (timeSelector.value.trim() === "") {
			console.error("You have not selected a time");
			return;
		}
		if (ticker.timerRunning() === true) {
			console.log(
				"A timer is currently running, if you would like to start a new now stop the only one first",
			);
			return;
		}

		if (ticker.timerRunning() === false && displayTime.textContent !== "0") {
			ticker.start();
			return;
		}

		if (displayTime.textContent === "0" || displayTime.textContent === null) {
			timeToCountDownFrom = timeSelector.valueAsNumber;
			displayTime.textContent = timeSelector.value;
			ticker.start();
		} else {
			timeToCountDownFrom = parseInt(displayTime.textContent);
			ticker.start();
		}
	};

	pauseButton.onclick = function () {
		if (timeSelector.value.trim() === "") {
			console.error("You have not selected a time");
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
		timeToCountDownFrom = 0;
	};
})();
