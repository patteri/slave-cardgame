export const loadState = (storage, key) => {
  try {
    const serializedState = storage.getItem(key);
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch (err) {
    return undefined;
  }
};

export const saveState = (storage, key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    storage.setItem(key, serializedState);
  }
  catch (err) {
    // Ignore write errors
  }
};
