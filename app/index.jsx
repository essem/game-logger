import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import eventsReducer from './reducers';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import Topbar from './components/Topbar.jsx';
import Home from './components/Home.jsx';
import Events from './components/Events.jsx';
import About from './components/About.jsx';

const app = document.createElement('div');
document.body.appendChild(app);

const store = createStore(
  combineReducers({
    events: eventsReducer,
    routing: routerReducer,
  }),
  undefined,
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Topbar}>
        <IndexRoute component={Home} />
        <Route path="events" component={Events} />
        <Route path="about" component={About} />
      </Route>
    </Router>
  </Provider>
), app);
