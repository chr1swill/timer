(function () {
	class Timer {
		/**
		 * @type{boolean}
		 */
		#isRunning;

		/**
		 * @type{number}
		 * This is only to be set by the start function
		 * to ensure the drift is as accurate as possible
		 *
		 * The expected is the Date.now() right before the timer starts
		 * allowing the timer to to have the best chance of having zero drift
		 * or atleast an ammout of drift that is easily recoverable without
		 * any timer deincrement skips
		 */
		#expected;

		/**
		 * @param{number} [startTime=0]
		 */
		constructor(startTime = 0) {
			this.startTime = startTime;
			this.interval = 1000;
			this.totalDrift = 0;
			this.timer = this.timer.bind(this);
			/**@type{number|null}*/
			this.timeout = setTimeout(() => this.timer(), this.interval);
			this.#isRunning = false;
			this.#expected = 0;
		}

		isTicking() {
			return this.#isRunning;
		}

		timer() {
			if (this.startTime <= 0) {
				this.reset();
				console.log("Timer hit zero");
				return;
			}

			this.#expected += this.interval;
			const now = Date.now();
			console.log("Expected time: ", this.#expected);
			console.log("Time now:      ", now);

			const drift = now - this.#expected;

			this.totalDrift += drift;

			if (now !== this.#expected) {
				this.totalDrift -= drift;

				if (this.timeout === null) {
					console.error("timer is not running, cannot start it");
					return;
				}

				console.log("This is the OLD timeout id: ", this.timeout);
				clearTimeout(this.timeout);
				this.timeout = setTimeout(
					() => this.timer(),
					Math.max(0, this.interval - drift),
				);
				console.log("This is the NEW timeout id: ", this.timeout);
				console.log(
					"This is the current interval: ",
					Math.max(0, this.interval - drift),
				);

				this.startTime--;
				self.postMessage(this.startTime);
				return;
			}

			if (this.timeout === null) {
				console.error("timer is not running, cannot stop it");
				return;
			}

			console.log("This is the OLD timeout id: ", this.timeout);
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.timer(), Math.max(0, this.interval));
			console.log("This is the NEW timeout id: ", this.timeout);

			this.startTime--;
			self.postMessage(this.startTime);
		}

		start() {
			if (this.#isRunning === true) {
				console.error("Timer is running, cannot start it again");
				return;
			}

			this.#isRunning = true;
			console.log("In start() this.#isRunning set to: ", this.#isRunning);

			this.#expected = Date.now();
			this.timeout = setTimeout(() => this.timer(), this.interval);
			console.log("This is the START timeout id: ", this.timeout);
		}

		stop() {
			console.log("In stop() this.#isRunning set to: ", this.#isRunning);

			this.#isRunning = false;
			this.#expected = 0;
			if (this.timeout === null) {
				console.error("There is no timeout to clear");
				return;
			}

			console.log("This is the STOPPED timeout id: ", this.timeout);
			clearTimeout(this.timeout);
			clearTimeout(this.timeout - 1);
			this.timeout = null;
		}

		reset() {
			if (this.#isRunning === true) this.stop();
			this.startTime = 0;
			this.interval = 1000;
			this.totalDrift = 0;
		}
	}

	(function timerState() {
		/**
		 * @param{number} minsInputValue
		 * @param{number} secsInputValue
		 * @returns{number} total number of seconds from inputs
		 */
		function normalizeInputedTimeToSeconds(minsInputValue, secsInputValue) {
			return minsInputValue * 60 + secsInputValue;
		}

		const timer = new Timer();

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
					if (timer.isTicking() === true) {
						console.warn(
							"Timer is already running, stop the timer before starting a new one",
						);
						return;
					}

					console.log("timer on timer: ", timer.startTime);
					if (timer.startTime > 0) {
						timer.start();
						return;
					}

					const message = /**@type{StartMsg}*/ (data);
					const totalSeconds = normalizeInputedTimeToSeconds(
						message.options.minutes,
						message.options.seconds,
					);

					if (timer.startTime === 0) {
						timer.startTime = totalSeconds;
						timer.start();
					}
					break;
				case /**@type{import("../../types/types").CommandType.STOP} = 1*/ 1:
					timer.stop();
					break;
				case /**@type{import("../../types/types").CommandType.RESET = 2}*/ 2:
					timer.reset();
					this.postMessage(0);
					break;
				default:
					console.error(
						"recieved message data of an unknown type",
						data.command,
					);
			}
		});

		self.addEventListener("messageerror", function (e) {
			console.error("Error: ", e, " Source: ", e.source);
		});

		self.addEventListener("error", function (e) {
			console.error("Error: ", e.error);
		});
	})();
})();
