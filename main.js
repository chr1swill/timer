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
	 * @param{Function} workFunc
	 * @param{number} interval
	 * @param{Function} errorFunc
	 */
	constructor(workFunc, interval, errorFunc) {
		this.workFunc = workFunc;
		this.interval = interval;
		this.errorFunc = errorFunc;
		this.step = this.step.bind(this);
	}

	/*
	 * @public
	 */
	start() {
		const now = Date.now();
		this.expected = now + this.interval;
		this.timeout = window.setTimeout(() => this.step(), this.interval);
	}

	/*
	 * @public
	 */
	stop() {
		window.clearTimeout(this.timeout);
	}

	/*
	 * @private
	 */
	step() {
		const now = Date.now();
		const drift = this.expected - now;
		if (drift > this.interval) {
			if (this.errorFunc) this.errorFunc();
		}
		this.workFunc();
		this.expected += this.interval;
		this.timeout = window.setTimeout(this.step, Math.max(0, this.interval));
	}
}

let justSomeNumber = 0;

const doWork = function () {
	console.log(++justSomeNumber);
};

const doError = function () {
	console.warn("The drift exceeded the interval.");
};

const ticker = new TimerController(doWork, 1000, doError);
ticker.start();
