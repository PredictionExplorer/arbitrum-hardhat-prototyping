// #region

"use strict";

// #endregion
// #region `sleepForMilliSeconds`

/**
 * @param {number} durationInMilliSeconds_
 */
function sleepForMilliSeconds(durationInMilliSeconds_) {
	return new Promise((resolve_) => (setTimeout(resolve_, durationInMilliSeconds_)));
}

// #endregion
// #region

module.exports = {
	sleepForMilliSeconds,
};

// #endregion
