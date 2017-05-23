export const loadState = (storage) => {
  try {
    const serializedState = storage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch (err) {
    return undefined;
  }
};

export const saveState = (storage, state) => {
  try {
    const serializedState = JSON.stringify(state);
    storage.setItem('state', serializedState);
  }
  catch (err) {
    // Ignore write errors
  }
};
