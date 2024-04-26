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
	 * @param{Function} workFunc
	 * @param{number} interval
	 * @param{Function} errorFunc
	 */
	constructor(workFunc, interval, errorFunc) {
		this.workFunc = workFunc;
		this.interval = interval;
		this.errorFunc = errorFunc;
	}

	/*
	 * @public
	 */
	start() {
		this.expected = Date.now() + this.interval;
		this.timeout = setTimeout(this.step, this.interval);
	}

	/*
	 * @public
	 */
	stop() {
		clearTimeout(this.timeout);
	}

	/*
	 * @private
	 */
	step() {
		const drift = Date.now() - this.expected;
		if (drift > this.interval) {
			if (this.errorFunc) this.errorFunc();
		}
		() => this.workFunc;
		this.expected += this.interval;
		this.timeout = setTimeout(this.step, Math.max(0, this.interval));
	}
}

let justSomeNumber = 0;

// Define the work to be done
const doWork = function () {
	console.log(++justSomeNumber);
};

// Define what to do if something goes wrong
const doError = function () {
	console.warn("The drift exceeded the interval.");
};

const ticker = new TimerController(doWork, 10000, doError);
ticker.start();
