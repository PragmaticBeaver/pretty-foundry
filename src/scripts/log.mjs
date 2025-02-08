const PREFIX = "Pretty Mixer | ";
const LOG_LEVEL_INDEX = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};
const LOG_LEVEL = LOG_LEVEL_INDEX.DEBUG;

export function logToConsole(msg, data) {
  if (LOG_LEVEL > LOG_LEVEL_INDEX.DEBUG) {
    return;
  }
  console.log(`%c ${PREFIX} ${msg} ${data || ""}`, "color:#6495ED");
}

export function infoToConsole(msg, data) {
  if (LOG_LEVEL > LOG_LEVEL_INDEX.INFO) {
    return;
  }
  console.info(`%c ${PREFIX} ${msg} ${data || ""}`, "color:green");
}

export function warnToConsole(msg, data) {
  if (LOG_LEVEL > LOG_LEVEL_INDEX.WARN) {
    return;
  }
  console.warn(`%c ${PREFIX} ${msg} ${data || ""}`, "color:#DAA520");
}

export function errorToConsole(msg, data) {
  console.error(`%c ${PREFIX} ${msg} ${data || ""}`, "color:red");
}
