const event = (state = {}, action) => {
  switch (action.type) {
    case 'INIT_EVENT':
      return action.event;

    default:
      return state;
  }
};

export default event;
