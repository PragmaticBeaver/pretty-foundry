import { logToConsole } from "./log.mjs";

const OBSERVABLES = {};

/**
 * Wraps a target object in a Proxy, so that every update can be tracked.
 * The Proxy will emit events using FoundryVTT-Hooks.
 * @param {Record<string,any>} target
 * @param {string} getHook will emit { target, prop, receiver, returnVal, passthrough }
 * @param {string} setHook will emit { target, key, value, passthrough }
 * @param {boolean} [callAll=false] switch between Hooks.call and Hooks.callAll (see FoundryVTT docs for more information).
 * @param {*} passthrough will be passed through to subscriber
 * @returns {Proxy}
 */
export function makeObservable(
  target,
  getHook,
  setHook,
  callAll = false,
  passthrough
) {
  const knownTarget = OBSERVABLES[target?.pmState?.pmId];
  if (knownTarget) {
    const changes = evalChanges(target, knownTarget);
    if (changes) {
      logToConsole(changes);
      // todo implement proxy override ?
    }
    return knownTarget;
  }

  const handler = {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop);
      const returnVal = typeof val === "function" ? val.bind(target) : val;
      const obj = { target, prop, receiver, returnVal, passthrough };
      callAll ? Hooks.callAll(getHook, obj) : Hooks.call(getHook, obj);
      return returnVal;
    },
    set(target, key, value) {
      const success = Reflect.set(target, { key, value });
      const obj = { target, key, value, passthrough };
      callAll ? Hooks.callAll(setHook, obj) : Hooks.call(setHook, obj);
      return success;
    },
  };
  const pmId = crypto?.randomUUID() || generateId();
  target.pmState = {
    pmId,
    getHook,
    setHook,
    callAll,
    passthrough,
  };
  const proxy = new Proxy(target, handler);
  OBSERVABLES[pmId] = proxy;
  return proxy;
}

function evalChanges(targetA, targetB) {
  const changes = [];

  const stateA = targetA.pmState;
  const stateB = targetB.pmState;

  // check properties of targetA
  for (const [key, value] of Object.entries(stateA)) {
    const stateBVal = stateB[key];

    value !== stateBVal && !changes.includes(key)
      ? changes.push(key)
      : undefined;
  }
  // check properties of targetB
  for (const [key, value] of Object.entries(stateB)) {
    const stateAVal = stateA[key];

    value !== stateAVal && !changes.includes(key)
      ? changes.push(key)
      : undefined;
  }

  return changes.length > 0 ? changes : undefined;
}

function generateId() {
  let dateTime = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char) => {
      var r = (dateTime + Math.random() * 16) % 16 | 0;
      dateTime = Math.floor(dateTime / 16);
      return (char == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
