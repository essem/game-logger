import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Reducers
import appReducer from './reducers/app';
import eventsReducer from './reducers/events';
import eventReducer from './reducers/event';
import usersReducer from './reducers/users';
import userReducer from './reducers/user';

// CSS
import './app.css';
import 'fontsource-roboto';

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
  window.devToolsExtension ? window.devToolsExtension() : undefined,
);

http.init(store);

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={Topbar} />
    </BrowserRouter>
  </Provider>,
  // </React.StrictMode>,
  app,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
