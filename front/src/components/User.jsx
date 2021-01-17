import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import http from '../http';
import { initUser, clearUser } from '../reducers/user';

export default function User({ match }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const userId = parseInt(match.params.id, 10);
      try {
        const user = await http.get(`/api/users/${userId}`);
        dispatch(initUser(user));
      } catch (err) {}
    })();
    return () => dispatch(clearUser());
  }, [dispatch, match.params.id]);

  const renderAgainstOther = (other) => {
    const games = _.flatMap(user.events, (event) => event.games);
    const win = games.reduce(
      (n, g) =>
        n + (_.includes(g.winners, user.id) && _.includes(g.losers, other)),
      0,
    );
    const lose = games.reduce(
      (n, g) =>
        n + (_.includes(g.winners, other) && _.includes(g.losers, user.id)),
      0,
    );

    if (win === 0 && lose === 0) {
      return <tr key={other} />;
    }

    return (
      <tr key={other}>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{win}</b> W
        </td>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{lose}</b> L
        </td>
        <td>vs. {user.users[other]}</td>
      </tr>
    );
  };

  const renderAgainstEachOther = () => {
    const users = Object.keys(user.users).map((u) => parseInt(u, 10));
    let others = users.filter((u) => u !== user.id);
    others = _.sortBy(others, (u) => user.users[u]);
    return (
      <Paper>
        <Box p={2}>
          <Typography variant="h6">vs. Others</Typography>
          <table>
            <tbody>{others.map((other) => renderAgainstOther(other))}</tbody>
          </table>
        </Box>
      </Paper>
    );
  };

  const renderEvent = (event) => {
    const win = event.games.reduce(
      (n, g) => n + _.includes(g.winners, user.id),
      0,
    );
    const lose = event.games.reduce(
      (n, g) => n + _.includes(g.losers, user.id),
      0,
    );
    const style = { paddingRight: '10px' };
    return (
      <tr key={event.id}>
        <td style={style}>
          <Link to={`/events/${event.id}/summary`} component={RouterLink}>
            {event.name}
          </Link>
        </td>
        <td style={style}>
          <b>{win}</b> Win
        </td>
        <td>
          <b>{lose}</b> Lose
        </td>
      </tr>
    );
  };

  const renderEvents = () => {
    const events = _.sortBy(user.events, (e) => -e.id);
    return (
      <Paper>
        <Box p={2}>
          <Typography variant="h6">Events</Typography>
          <table>
            <tbody>{events.map((event) => renderEvent(event))}</tbody>
          </table>
        </Box>
      </Paper>
    );
  };

  if (!user) {
    return <div />;
  }

  const games = _.flatMap(user.events, (event) => event.games);
  const win = games.reduce((n, g) => n + _.includes(g.winners, user.id), 0);
  const lose = games.reduce((n, g) => n + _.includes(g.losers, user.id), 0);

  return (
    <Container>
      <Paper>
        <Box p={2}>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2">
            <b>{win}</b> Win <b>{lose}</b> Lose
          </Typography>
        </Box>
      </Paper>
      <br />
      {renderAgainstEachOther()}
      <br />
      {renderEvents()}
    </Container>
  );
}
