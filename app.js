const body = document.body;
const myDisplay = document.createElement("div");
body.prepend(myDisplay);

if (window.Worker) {
	const myWorker = new Worker("worker.js");

	myWorker.onmessage = function (e) {
		myDisplay.innerText = e.data;
		console.log("Seconds Elapsed: ", e.data);
	};
} else {
	console.error("workers not supported");
}
