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

  return fetch(`${API_HOST}${path}`, options)
  .then(res => res.json());
}

exports.get = path => request(path, 'get');
exports.post = (path, body) => request(path, 'post', body);
exports.put = (path, body) => request(path, 'put', body);
exports.delete = path => request(path, 'delete');
