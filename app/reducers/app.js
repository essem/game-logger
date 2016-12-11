import jwtDecode from 'jwt-decode';

const app = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      {
        const decoded = jwtDecode(action.token);
        return {
          ...state,
          token: action.token,
          account: decoded.account,
          admin: decoded.admin,
        };
      }

    case 'LOGOUT':
      return {
        ...state,
        token: null,
        account: null,
        admin: null,
      };

    default:
      return state;
  }
};

export default app;
