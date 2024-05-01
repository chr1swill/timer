const body = document.body;
const myDisplay = document.createElement("div");
body.prepend(myDisplay);

if (window.Worker) {
	const myWorker = new Worker("workers/worker.js");

	myWorker.onmessage = function (e) {
		myDisplay.innerText = e.data;
	};
} else {
	console.error("workers not supported");
}

(function () {
	if (!window.Worker) {
		console.error("workers are not supported in your environment");
		return;
	}

	const timer = new Worker("workers/timer.js");

	/**
	 * @type{HTMLParagraphElement|null}
	 */
	const display = document.querySelector("[data-display-time='0']");
	if (display === null) {
		console.error("Could not find display element");
		return;
	}

	/**
	 * @type{HTMLButtonElement|null}
	 */
	const startBtn = document.querySelector("[data-start-timer='0']");
	if (startBtn === null) {
		console.error("Could not find start button");
		return;
	}

	/**
	 * @type{HTMLButtonElement|null}
	 */
	const resetBtn = document.querySelector("[data-reset-timer='0']");
	if (resetBtn === null) {
		console.error("Could not find reset button");
		return;
	}

	/**
	 * @type{HTMLButtonElement|null}
	 */
	const stopBtn = document.querySelector("[data-stop-timer='0']");
	if (stopBtn === null) {
		console.error("Could not find stop button");
		return;
	}

	/**
	 * @type{HTMLInputElement|null}
	 */
	const chooseMinsInput = document.querySelector(
		"[data-time-selector-mins='0']",
	);
	if (chooseMinsInput === null) {
		console.error("Could not find select mins input");
		return;
	}

	/**
	 * @type{HTMLInputElement|null}
	 */
	const chooseSecsInput = document.querySelector(
		"[data-time-selector-secs='0']",
	);
	if (chooseSecsInput === null) {
		console.error("Could not find select secs input");
		return;
	}

	/**
	 * @typedef{import("../types/types").StartMsg} StartMsg
	 */

	timer.onmessage = function (e) {
		display.innerText = e.data;
	};

	startBtn.onclick = function () {
		if (chooseMinsInput === null || chooseSecsInput === null) {
			console.error(
				"An attempt to access timer selector inputs returned a null value",
			);
			return;
		}

		if (
			isNaN(chooseMinsInput.valueAsNumber) ||
			isNaN(chooseSecsInput.valueAsNumber)
		) {
			console.error(
				"Accessing the values of the inputs ressulted in a non number value, could not start timer",
			);
			return;
		}

		/**
		 * @type{StartMsg}
		 */
		const data = {
			type: "start",
			minutes: chooseMinsInput.valueAsNumber,
			seconds: chooseSecsInput.valueAsNumber,
		};

		timer.postMessage(data);
	};

	stopBtn.onclick = function () {
		timer.postMessage("stop");
	};

	resetBtn.onclick = function () {
		timer.postMessage("reset");
	};
})();
