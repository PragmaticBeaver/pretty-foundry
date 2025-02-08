// export function logToConsole(...args) {
//   console.log("Pretty Mixer |", ...args);
// }

// export function infoToConsole(...args) {
//   console.info("Pretty Mixer |", ...args);
// }

// export function warnToConsole(...args) {
//   console.warn("Pretty Mixer |", ...args);
// }

// export function errorToConsole(...args) {
//   console.error("Pretty Mixer |", ...args);
// }

const PREFIX = "Pretty Mixer | ";
const LOG_LEVEL = LOG_LEVEL_INDEX.DEBUG;

const LOG_LEVEL_INDEX = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

function _log(level, msg, data) {
  const dataVal = data ? JSON.stringify(data) : "";
  if (LOG_LEVEL >= LOG_LEVEL_INDEX[level]) {
    console.log(PREFIX, msg, dataVal);
  }
}

export const Logger = {
  log: (msg, data) => _log(LOG_LEVEL_INDEX.DEBUG, msg, data),
  info: () => {},
  warn: () => {},
  error: () => {},
};

// static func debug(message: String, data: Variant = null):
// 	if not DEBUG_CONFIG.log_debug:
// 		return
// 	_log("DEBUG", "white", message, data)

// static func info(message: String, data: Variant = null):
// 	if not DEBUG_CONFIG.log_info:
// 		return
// 	_log("INFO", "green", message, data)

// static func warn(message: String, data: Variant = null):
// 	if not DEBUG_CONFIG.log_warn:
// 		return
// 	push_warning(message, data)
// 	_log("WARN", "yellow", message, data)

// static func error(message: String, data: Variant = null):
// 	if not DEBUG_CONFIG.log_error:
// 		return
// 	push_error(message, data)
// 	_log("ERROR", "red", message, data)
