let count = 0;
let interval = 1000;
let expected = Date.now();
let totalDrift = 0;

function timer() {
	interval = 1000;

	expected += interval;
	console.log("expected time: ", expected);

	const now = Date.now();
	console.log("real time: ", now);

	const drift = now - expected;
	console.log("drift: ", drift);

	totalDrift += drift;

	if (now !== expected) {
		interval = interval - drift;
		totalDrift -= drift;
	}
	console.log("Current interval: ", interval);

	console.log("accumlated drift: ", totalDrift);

	count++;
	postMessage(count);
}

setInterval(timer, interval);
