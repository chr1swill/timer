(function () {
	class Timer {
		#isRunning = false;

		/**
		 * @param{number} startTime
		 */
		constructor(startTime) {
			this.startTime = startTime;
			this.interval = 1000;
			this.expected = Date.now();
			this.totalDrift = 0;
			this.timer = this.timer.bind(this);
			/**@type{number|null}*/
			this.timeout = setTimeout(() => this.timer(), this.interval);
		}

		timer() {
			if (this.startTime <= 0) {
				this.stop();
				console.log("Timer hit zero");
				return;
			}

			this.expected += this.interval;
			const now = Date.now();
			console.log("Expected time: ", this.expected);
			console.log("Time now:      ", now);

			const drift = now - this.expected;

			this.totalDrift += drift;

			if (now !== this.expected) {
				this.totalDrift -= drift;

				if (this.timeout === null) {
					console.error("Timer is not running, cannot stop it");
					return;
				}

				clearTimeout(this.timeout);
				this.timeout = setTimeout(
					() => this.timer(),
					Math.max(0, this.interval - drift),
				);
				console.log(
					"This is the current interval: ",
					Math.max(0, this.interval - drift),
				);
			}

			this.startTime--;
			self.postMessage(this.startTime);
		}

		start() {
			if (this.#isRunning === true) {
				console.error("Timer is running, cannot start it again");
				return;
			}

			this.#isRunning = true;
			this.timeout = setTimeout(() => this.timer(), this.interval);
		}

		stop() {
			if (this.#isRunning === false) {
				console.error("Timer is not running, cannot stop it");
				return;
			}

			this.#isRunning = false;
			if (this.timeout === null) {
				console.error("There is no timeout to clear");
				return;
			}

			clearTimeout(this.timeout);
			this.timeout = null;
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

	self.addEventListener("messageerror", function (e) {
		console.error("Error: ", e.data);
	});
})();
