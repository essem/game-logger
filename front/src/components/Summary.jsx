import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

export default function Summary() {
  const event = useSelector((state) => state.event);

  const renderRankingByWins = () => {
    let players = event.players.map((p) => ({
      id: p.id,
      name: p.user.name,
      win: 0,
      lose: 0,
    }));
    for (const game of event.games) {
      for (const winner of game.winners) {
        players.find((p) => p.id === winner).win += 1;
      }
      for (const loser of game.losers) {
        players.find((p) => p.id === loser).lose += 1;
      }
    }

    players = players.sort((a, b) => b.win - a.win);

    return (
      <Paper>
        <Box p={3}>
          <div style={{ marginBottom: '10px' }}>Ranking by wins</div>
          <table>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td style={{ textAlign: 'right', paddingRight: '10px' }}>
                    <b>{p.win}</b> W
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '10px' }}>
                    <b>{p.lose}</b> L
                  </td>
                  <td>{p.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    );
  };

  const renderAgainstOther = (player, other) => {
    let win = 0;
    let lose = 0;

    for (const game of event.games) {
      if (
        game.winners.indexOf(player.id) !== -1 &&
        game.losers.indexOf(other.id) !== -1
      ) {
        win += 1;
      }
      if (
        game.losers.indexOf(player.id) !== -1 &&
        game.winners.indexOf(other.id) !== -1
      ) {
        lose += 1;
      }
    }

    return (
      <tr key={other.id}>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{win}</b> W
        </td>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{lose}</b> L
        </td>
        <td>vs. {other.user.name}</td>
      </tr>
    );
  };

  const renderAgainstEachOther = (player) => {
    let others = event.players.filter((other) => other.id !== player.id);
    others = _.sortBy(others, (p) => p.user.name);
    return (
      <React.Fragment key={player.id}>
        <Paper>
          <Box p={3}>
            <div style={{ marginBottom: '10px' }}>{player.user.name}</div>
            <table>
              <tbody>
                {others.map((other) => renderAgainstOther(player, other))}
              </tbody>
            </table>
          </Box>
        </Paper>
        <br />
      </React.Fragment>
    );
  };

  if (event.games.length === 0) {
    return (
      <Container>
        <Box
          style={{
            textAlign: 'center',
            margin: '20px',
            fontSize: '12px',
            fontStyle: 'italic',
          }}
        >
          There is no game yet
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <br />
      <Paper>
        <Box p={3}>
          <b>{event.players.length}</b> players played{' '}
          <b>{event.games.length}</b> games.
        </Box>
      </Paper>
      <br />
      {renderRankingByWins()}
      <br />
      {event.players.map((player) => renderAgainstEachOther(player))}
    </Container>
  );
}
