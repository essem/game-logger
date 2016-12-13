const events = (state = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS':
      return [...action.events];

    case 'CREATE_EVENT':
      return [...state, action.event];

    case 'DELETE_EVENT':
      return state.filter(e => e.id !== action.id);

    default:
      return state;
  }
};

export default events;
