import jwtDecode from 'jwt-decode';

const app = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      {
        localStorage.setItem('token', action.token);
        const decoded = jwtDecode(action.token);
        return {
          ...state,
          token: action.token,
          account: decoded.account,
          admin: decoded.admin,
        };
      }

    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        account: null,
        admin: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };

    case 'CLEAR_LOADING':
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default app;
