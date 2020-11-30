const users = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return [...action.users];

    case 'CREATE_USER':
      return [...state, action.user];

    default:
      return state;
  }
};

export default users;
