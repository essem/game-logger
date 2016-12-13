const event = (state = null, action) => {
  switch (action.type) {
    case 'INIT_EVENT':
      return action.event;

    case 'CREATE_PLAYER':
      return {
        ...state,
        players: [...state.players, action.player],
      };

    case 'CREATE_GAME':
      return {
        ...state,
        games: [...state.games, action.game],
      };

    case 'DELETE_GAME':
      return {
        ...state,
        games: state.games.filter(g => g.id !== action.id),
      };

    case 'FINISH_EVENT':
      return {
        ...state,
        finished: true,
      };

    case 'REOPEN_EVENT':
      return {
        ...state,
        finished: false,
      };

    case 'DELETE_EVENT':
      return null;

    case 'CLEAR_EVENT':
      return null;

    default:
      return state;
  }
};

export default event;
