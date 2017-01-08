import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

// https://github.com/ReactTraining/react-router/issues/4006
import createBrowserHistory from 'react-router/node_modules/history/lib/createBrowserHistory';

import appReducer from './reducers/app';
import eventsReducer from './reducers/events';
import eventReducer from './reducers/event';
import usersReducer from './reducers/users';
import userReducer from './reducers/user';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './public/app.css';
import Topbar from './components/Topbar';
import Home from './components/Home';
import Login from './components/Login';
import Events from './components/Events';
import Event from './components/Event';
import Players from './components/Players';
import Games from './components/Games';
import Summary from './components/Summary';
import Users from './components/Users';
import User from './components/User';

const app = document.createElement('div');
document.body.appendChild(app);

const store = createStore(
  combineReducers({
    app: appReducer,
    events: eventsReducer,
    event: eventReducer,
    users: usersReducer,
    user: userReducer,
    routing: routerReducer,
  }),
  undefined,
  window.devToolsExtension ? window.devToolsExtension() : undefined
);
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: SUB_URI,
});
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Topbar}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="events">
          <IndexRoute component={Events} />
          <Route path=":id" component={Event}>
            <Route path="players" component={Players} />
            <Route path="games" component={Games} />
            <Route path="summary" component={Summary} />
          </Route>
        </Route>
        <Route path="Users">
          <IndexRoute component={Users} />
          <Route path=":id" component={User} />
        </Route>
      </Route>
    </Router>
  </Provider>
), app);
