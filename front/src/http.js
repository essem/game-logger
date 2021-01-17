import { setLoading, clearLoading } from './reducers/app';

let dispatch;

async function request(path, method, body) {
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

  dispatch(setLoading());

  try {
    const res = await fetch(path, options);
    return await res.json();
  } finally {
    dispatch(clearLoading());
  }
}

const http = {
  init: (store) => {
    dispatch = store.dispatch;
  },
  get: (path) => request(path, 'get'),
  post: (path, body) => request(path, 'post', body),
  put: (path, body) => request(path, 'put', body),
  delete: (path) => request(path, 'delete'),
};

export default http;
