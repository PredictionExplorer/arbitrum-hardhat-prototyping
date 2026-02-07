// #region

"use strict";

// #endregion
// #region `sleepForMilliSeconds`

/**
 * @param {number} durationInMilliSeconds_
 */
function sleepForMilliSeconds(durationInMilliSeconds_) {
	// Issue. This is not the best implementation.
	// It would be better to import "node:timers/promises" and call `await setTimeout(durationInMilliSeconds_)` from there.
	return new Promise((resolve_) => (setTimeout(resolve_, durationInMilliSeconds_)));
}

// #endregion
// #region

module.exports = {
	sleepForMilliSeconds,
};

// #endregion
