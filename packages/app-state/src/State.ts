/**
 * Application State
 * @typedef {Object} StateObject
 */
type StateObject = {
  [key: string]: any;
};

// TODO: Store State in indexed DB instead of local storage.
// 				Keep a table for every scope.
//				Each row is a state in history.

/**
 * Checks if arguemtn is a valid StateObject
 */
function isAnStateObject(something) {
  return (
    something != null &&
    typeof something !== "string" &&
    !Number.isNaN(something) &&
    Object.values(something).length > 0
  );
}

/**
 * Stores the application state
 */
const state: StateObject = {};

export default class State {
  /**
   * This getter returns the current global state
   */
  public static get currentState(): StateObject {
    return state;
  }

  /**
   * Updates state in scope
   */
  public static setState(scope: string, newState: any) {
    // deep copy new state and save to global state
    // NEXT: replace JSON with "deepcopy" at some point
    state[scope] = Object.assign(
      state[scope] || {},
      JSON.parse(JSON.stringify(newState))
    );
    this.emitChange(scope);
  }

  /**
   * delete state in scope
   */
  public static deleteState(scope: string, stateKey: string) {
    delete state[scope][stateKey];
    this.emitChange(scope);
  }

  /**
   * delete scope in state
   */
  public static deleteScope(scope: string) {
    delete state[scope];
    this.emitChange(scope);
  }

  /**
   * get state of scope
   */
  public static getState(scope = "global") {
    return state[scope] || {};
  }

  /**
   * send change to all listeners in scope
   */
  private static emitChange(scope: string) {
    const ev = new Event("state:update:" + scope);
    window.dispatchEvent(ev);
    localStorage.setItem("app-state", JSON.stringify(state));
  }

  /**
   * listen to state changes of scope
   */
  public static onState(
    scope = "global",
    callback: (s: StateObject) => void
  ): () => void {
    let lastState = {};

    const eventName = "state:update:" + scope;
    const handler = (e) => {
      const state = State.getState(scope);
      const stateChanges = State.subtractState(lastState, state);
      lastState = JSON.parse(JSON.stringify(state));
      // Only serve changed state keys
      if (Object.keys(stateChanges).length > 0) {
        callback(stateChanges);
      }
    };

    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }

  /**
   * merge two state objects (A + B)
   */
  public static mergeState(
    stateA: StateObject,
    stateB: StateObject
  ): StateObject {
    const itterateKeys = (objectA: StateObject, objectB: StateObject) => {
      const local = JSON.parse(JSON.stringify(objectA));

      const allKeys = new Set([
        ...Object.keys(objectA),
        ...Object.keys(objectB),
      ]);

      for (const key of allKeys) {
        if (key in objectA && key in objectB) {
          // exists, itterate through this object too, if it is an object
          const bValue = objectB[key];

          if (isAnStateObject(bValue) && isAnStateObject(objectA[key])) {
            local[key] = itterateKeys(objectA[key], bValue);
          } else {
            local[key] = bValue;
          }
        } else {
          const value = objectA[key] || objectB[key];
          if (value != null) {
            local[key] = JSON.parse(JSON.stringify(value));
          }
        }
      }

      return local;
    };

    return itterateKeys(stateA, stateB);
  }

  /**
   * compare two states and return differneces from A to B (B - A)
   */
  public static subtractState(
    stateA: StateObject,
    stateB: StateObject
  ): StateObject {
    // TODO: Compare this method with comparing two serialized state strigns

    const itterateKeys = (
      objectA: StateObject,
      objectB: StateObject
    ): StateObject => {
      const local = {};

      const allKeys = new Set([
        ...Object.keys(objectA),
        ...Object.keys(objectB),
      ]);

      for (const key of allKeys) {
        if (key in objectA && key in objectB) {
          // exists in both objects, itterate through this object too, if it is an object
          const bValue = objectB[key];

          if (Array.isArray(bValue) && Array.isArray(objectA[key])) {
            if (objectA[key] !== bValue) {
              local[key] = bValue != null ? bValue : null;
            }
          } else if (isAnStateObject(bValue) && isAnStateObject(objectA[key])) {
            local[key] = itterateKeys(objectA[key], bValue);
          } else {
            if (objectA[key] !== bValue) {
              local[key] = bValue != null ? bValue : null;
            }
          }
        } else {
          // exists in only one of them
          const value = objectB[key];
          if (value != null) {
            local[key] = JSON.parse(JSON.stringify(value));
          } else {
            local[key] = null;
          }
        }
      }

      return local;
    };

    return itterateKeys(stateA, stateB);
  }

  /**
   * compare two states
   */
  public static compareState(
    stateA: StateObject,
    stateB: StateObject
  ): boolean {
    return JSON.stringify(stateA) == JSON.stringify(stateB);
  }
}

// Global State var for development
declare global {
  interface Window {
    State: State;
  }
}
window.State = State;
