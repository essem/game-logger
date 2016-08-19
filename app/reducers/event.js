const initialState = {
  players: [],
  games: [],
};

const event = (state = initialState, action) => {
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

    default:
      return state;
  }
};

export default event;
