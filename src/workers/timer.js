(function () {
	class Timer {
		/**
		 * @param{number} startTime
		 */
		constructor(startTime) {
			this.startTime = startTime;
			this.interval = 1000;
			this.expected = Date.now();
			this.totalDrift = 0;
			this.timer = this.timer.bind(this);
			this.timeout = setInterval(() => this.timer(), this.interval);
		}

		timer() {
			if (this.startTime <= 0) {
				this.stop();
				console.log("Timer hit zero");
				return;
			}

			console.log("START TIMER");
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
				console.log("DRIFT: ", drift);
				console.log("INTERVAL: ", this.interval);
				this.totalDrift -= drift;
				console.log("There was some drift");
				clearInterval(this.timeout);
				this.timeout = setInterval(() => this.timer(), this.interval);
			}

			console.log("Current interval: ", this.interval);
			console.log("Total drift: ", this.totalDrift);

			this.startTime--;
			self.postMessage(this.startTime);
			console.log("current time: ", this.startTime);
			console.log("END TIMER");
		}

		start() {
			this.timeout = setInterval(() => this.timer(), this.interval);
		}

		stop() {
			clearInterval(this.timeout);
		}
	}

	/**
	 * @param{number} minsInputValue
	 * @param{number} secsInputValue
	 * @returns{number} total number of seconds from inputs
	 */
	function normalizeInputedTimeToSeconds(minsInputValue, secsInputValue) {
		return minsInputValue * 60 + secsInputValue;
	}

	/**
	 * @typedef{import("../../types/types").MessageT} MessageT
	 *
	 * @typedef{import("../../types/types").StartMsg} StartMsg
	 */
	self.addEventListener("message", function (e) {
		/**
		 * @type{MessageT}
		 */
		const data = e.data;

		/**
		 * @link{import("../../types/types").CommandType}
		 * Check that enum for better understand of the values of this switch
		 */
		switch (data.command) {
			case /**@type{import("../../types/types").CommandType.START} = 0 */ 0:
				const message = /**@type{StartMsg}*/ (data);
				const totalSeconds = normalizeInputedTimeToSeconds(
					message.options.minutes,
					message.options.seconds,
				);

				const timer = new Timer(totalSeconds);
				timer.start();
				break;
			case /**@type{import("../../types/types").CommandType.STOP} = 1*/ 1:
				break;
			case /**@type{import("../../types/types").CommandType.RESET = 2}*/ 2:
				break;
			default:
				console.error("recieved message data of an unknown type", data.command);
		}
	});
})();
