const events = (state = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return [...action.events];

    case 'CREATE_EVENT':
      return [...state, action.event];

    default:
      return state;
  }
};

export default events;
