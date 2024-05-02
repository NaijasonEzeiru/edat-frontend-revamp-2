export const saveRouteState = (key, state) => {
    localStorage.setItem(key, JSON.stringify(state));
  };
  
  export const loadRouteState = (key) => {
    const stateJSON = localStorage.getItem(key);
    return stateJSON ? JSON.parse(stateJSON) : null;
  };