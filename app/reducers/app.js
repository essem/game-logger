const app = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        account: action.account,
        admin: action.admin,
      };

    case 'LOGOUT':
      return {
        ...state,
        account: null,
        admin: null,
      };

    default:
      return state;
  }
};

export default app;
