/**
 * @param{number} minsInputValue
 * @param{number} secsInputValue
 * @returns{number} total number of seconds from inputs
 */
function normalizeInputedTimeToSeconds(minsInputValue, secsInputValue) {
	return minsInputValue * 60 + secsInputValue;
}
