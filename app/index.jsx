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
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './public/app.css';
import Topbar from './components/Topbar.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Events from './components/Events.jsx';
import Event from './components/Event.jsx';
import Players from './components/Players.jsx';
import Games from './components/Games.jsx';
import Summary from './components/Summary.jsx';

const app = document.createElement('div');
document.body.appendChild(app);

const store = createStore(
  combineReducers({
    app: appReducer,
    events: eventsReducer,
    event: eventReducer,
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
      </Route>
    </Router>
  </Provider>
), app);
