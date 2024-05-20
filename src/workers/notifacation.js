(function () {
	self.addEventListener("install", function () {
		console.log("Service Worker: Installed");
	});

	self.onmessage = function (e) {
		const data = e.data.json();
		const options = {
			body: data.body,
			vibrate: [1000],
			data: {
				dataOfArrival: Date.now(),
				primaryKey: "2",
			},
		};

		//@ts-ignore
		e.waitUntil(self.registration.showNotifaction(data.title, options));
	};
})();
