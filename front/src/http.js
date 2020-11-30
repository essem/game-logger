let dispatch;

function request(path, method, body) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['x-access-token'] = token;
  }

  const options = {
    method,
    headers: new Headers(headers),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  dispatch({ type: 'SET_LOADING' });

  return fetch(
    `${process.env.REACT_APP_API_HOST}${process.env.REACT_APP_SUB_URI}${path}`,
    options,
  )
    .then((res) => {
      dispatch({ type: 'CLEAR_LOADING' });
      return res.json();
    })
    .catch((err) => {
      dispatch({ type: 'CLEAR_LOADING' });
      throw err;
    });
}

exports.init = (store) => {
  dispatch = store.dispatch;
};
exports.get = (path) => request(path, 'get');
exports.post = (path, body) => request(path, 'post', body);
exports.put = (path, body) => request(path, 'put', body);
exports.delete = (path) => request(path, 'delete');
