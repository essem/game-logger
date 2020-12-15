const initialState = {
  list: [],
  hasMore: true,
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_EVENTS':
      return {
        list: [...state.list, ...action.list],
        hasMore: action.hasMore,
      };

    case 'CREATE_EVENT':
      return {
        ...state,
        list: [...state.list, action.event],
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        list: state.list.filter((e) => e.id !== action.id),
      };

    case 'RESET_EVENTS':
      return {
        list: [],
        hasMore: true,
      };

    default:
      return state;
  }
};

export default events;
