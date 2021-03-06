import _ from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { Typography, Button, Chip } from '@material-ui/core';
import {
  useHistory,
  useLocation,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import Confirm from './Confirm';
import http from '../http';
import Players from './Players';
import Games from './Games';
import Summary from './Summary';
import {
  initEvent,
  createPlayers,
  deletePlayer,
  createGame,
  deleteGame,
  finishEvent,
  reopenEvent,
  deleteEvent,
  clearEvent,
} from '../reducers/event';

export default function Event({ match }) {
  const admin = useSelector((state) => state.app.admin);
  const event = useSelector((state) => state.event);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wsState, setWsState] = useState('offline');
  const socket = useRef(null);
  const wsReconnectTimer = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const wsConnect = () => {
    const eventId = parseInt(match.params.id, 10);
    const loc = window.location;
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = `${protocol}//${loc.host}/api`;

    socket.current = new WebSocket(wsHost, 'watch');
    socket.current.onopen = () => {
      setWsState('online');
      socket.current.send(JSON.stringify({ type: 'watch', eventId }));
      socket.current.onmessage = (e) => handleSocketMessage(e.data);
      socket.current.onclose = () => {
        this.setState({ wsState: 'offline' }, () => wsReconnect());
      };
    };
  };

  const wsReconnect = () => {
    if (wsState === 'online') {
      return;
    }

    wsReconnectTimer.current = setTimeout(wsReconnect, 2000);
    wsConnect();
  };

  const wsClose = () => {
    socket.current.onclose = () => {};
    socket.current.close();
  };

  const handleSocketMessage = (data) => {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'createGame':
        dispatch(createGame(message.game));
        break;
      case 'deleteGame':
        dispatch(deleteGame(message.gameId));
        break;
      case 'createPlayers':
        dispatch(createPlayers(message.players));
        break;
      case 'deletePlayer':
        dispatch(deletePlayer(message.playerId));
        break;
      case 'finish':
        dispatch(finishEvent());
        wsClose();
        break;
      default:
    }
  };

  useEffect(() => {
    (async () => {
      const eventId = parseInt(match.params.id, 10);

      try {
        const event = await http.get(`/api/events/${eventId}`);
        dispatch(initEvent(event));

        if (!event.finished) {
          wsConnect();
        }
      } catch (err) {}
    })();
    return () => {
      if (socket.current) {
        socket.current.onclose = () => {};
        socket.current.close();
      }
      if (wsReconnectTimer.current) {
        clearTimeout(wsReconnectTimer.current);
      }
      dispatch(clearEvent());
    };
    // TODO: remove eslint-disable-line
  }, [dispatch, match]); // eslint-disable-line

  const handleConfirmFinish = () => {
    setShowFinishConfirm(true);
  };

  const handleFinish = () => {
    setShowFinishConfirm(false);

    http.put(`/api/events/${event.id}/finish`).catch(() => {});
  };

  const handleCloseFinishConfirm = () => {
    setShowFinishConfirm(false);
  };

  const handleReopen = async () => {
    try {
      await http.put(`/api/events/${event.id}/reopen`);
      dispatch(reopenEvent());
      wsConnect();
    } catch (err) {}
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);

    try {
      const res = await http.delete(`/api/events/${event.id}`);
      dispatch(deleteEvent(res.id));
      history.push('/events');
    } catch (err) {}
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const renderWsBadge = () => {
    if (event.finished) {
      return '';
    }

    const wsStateBgColor = wsState === 'online' ? 'green' : 'red';

    return (
      <Chip
        size="small"
        style={{
          marginRight: '10px',
          backgroundColor: wsStateBgColor,
          color: 'white',
        }}
        label={wsState}
      />
    );
  };

  const renderFinishConfirm = () => {
    if (!showFinishConfirm) {
      return '';
    }

    return (
      <Confirm
        message="Finish the event?"
        okayText="Finish"
        okayColor="primary"
        onOkay={handleFinish}
        onCancel={handleCloseFinishConfirm}
      />
    );
  };

  const renderDeleteConfirm = () => {
    if (!showDeleteConfirm) {
      return '';
    }

    return (
      <Confirm
        message="Delete the event?"
        okayText="Delete"
        okayColor="secondary"
        onOkay={handleDelete}
        onCancel={handleCloseDeleteConfirm}
      />
    );
  };

  if (!event) {
    return <div />;
  }

  let finishButton = '';
  if (!event.finished) {
    finishButton = (
      <Button
        variant="contained"
        size="small"
        color="primary"
        disabled={event.games.length === 0}
        onClick={handleConfirmFinish}
      >
        Finish
      </Button>
    );
  } else if (admin) {
    finishButton = (
      <>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleReopen}
        >
          Re-open
        </Button>{' '}
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleConfirmDelete}
        >
          Delete
        </Button>
      </>
    );
  }

  // TODO: Remove flickering on switching tabs
  const lastPath = _.last(location.pathname.split('/'));
  const tabIndex = ['summary', 'players', 'games'].indexOf(lastPath);

  return (
    <div>
      <Container>
        <Paper>
          <Box display="flex" alignItems="center" p={3}>
            <Box flexGrow={1}>
              <Typography variant="h6">{event.name}</Typography>
            </Box>
            <Box>{renderWsBadge()}</Box>
            <Box>{finishButton}</Box>
          </Box>
        </Paper>
        {renderFinishConfirm()}
        {renderDeleteConfirm()}
        <br />
        <Paper>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={tabIndex}
          >
            <Tab
              to={`/events/${event.id}/summary`}
              component={RouterLink}
              label="Summary"
            />
            <Tab
              to={`/events/${event.id}/players`}
              component={RouterLink}
              label="Player"
            />
            <Tab
              to={`/events/${event.id}/games`}
              component={RouterLink}
              label="Games"
            />
          </Tabs>
        </Paper>
      </Container>
      <Route exact path={`${match.url}/players`} component={Players} />
      <Route exact path={`${match.url}/games`} component={Games} />
      <Route exact path={`${match.url}/summary`} component={Summary} />
    </div>
  );
}
