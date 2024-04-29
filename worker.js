let count = 0;
const interval = 1000;
let expected = Date.now();
let totalDrift = 0;

function timer() {
	expected += interval;
	console.log("expected time: ", expected);
	const now = Date.now();
	console.log("real time: ", now);
	const drift = now - expected;
	console.log("drift: ", drift);
	totalDrift += drift;
	console.log("accumlated drift: ", totalDrift);
	count++;
	postMessage(count);
}

setInterval(timer, interval);
