import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

// Reducers
import appReducer from './reducers/app';
import eventsReducer from './reducers/events';
import eventReducer from './reducers/event';
import usersReducer from './reducers/users';
import userReducer from './reducers/user';

// CSS
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './public/app.css';

// Components
import Topbar from './components/Topbar';

// Etc.
import http from './http';

const app = document.createElement('div');
document.body.appendChild(app);

const store = createStore(
  combineReducers({
    app: appReducer,
    events: eventsReducer,
    event: eventReducer,
    users: usersReducer,
    user: userReducer,
  }),
  undefined,
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

http.init(store);

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={Topbar} />
    </BrowserRouter>
  </Provider>
), app);
