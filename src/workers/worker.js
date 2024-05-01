//let count = 0;
//let interval = 1000;
//let expected = Date.now();
//let totalDrift = 0;

//function timer() {
//interval = 1000;

//expected += interval;
//console.log("expected time: ", expected);

//const now = Date.now();
//console.log("real time: ", now);

//const drift = now - expected;
//console.log("drift: ", drift);

//totalDrift += drift;

//if (now !== expected) {
//interval = interval - drift;
//totalDrift -= drift;
//}
//console.log("Current interval: ", interval);

//console.log("accumlated drift: ", totalDrift);

//count++;
//postMessage(count);
//}

//setInterval(timer, interval);

class Timer {
	/**
	 * @param{number} startTime
	 */
	constructor(startTime) {
		this.startTime = startTime;
		this.count = 0;
		this.interval = 1000;
		this.expected = Date.now();
		this.totalDrift = 0;
		this.timer = this.timer.bind(this);
	}

	timer() {
		this.interval = 1000;

		this.expected += this.interval;
		console.log("expected time: ", this.expected);

		const now = Date.now();
		console.log("real time: ", now);

		const drift = now - this.expected;
		console.log("drift: ", drift);

		this.totalDrift += drift;

		if (now !== this.expected) {
			this.interval = this.interval - drift;
			this.totalDrift -= drift;
			console.warn("There was some drift");
		}

		console.log("Current interval: ", this.interval);
		console.log("accumlated drift: ", this.totalDrift);

		this.count++;
		postMessage(this.count);
		console.log("count: ", this.count);
	}

	run() {
		setInterval(() => this.timer(), this.interval);
	}
}

const tm = new Timer();

tm.run();
