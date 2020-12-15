import jwtDecode from 'jwt-decode';

const initialState = {
  checkToken: true,
  token: null,
  account: '',
  admin: false,
  loading: false,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      if (action.token) {
        localStorage.setItem('token', action.token);
        const decoded = jwtDecode(action.token);
        return {
          ...state,
          checkToken: false,
          token: action.token,
          account: decoded.account,
          admin: decoded.admin,
        };
      }
      return {
        ...state,
        checkToken: false,
      };
    }

    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        account: '',
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
