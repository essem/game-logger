import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

class Summary extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
  };

  render() {
    const event = this.props.event;

    if (event.games.length === 0) {
      return (
        <Grid>
          <Row>
            <Col
              xs={12}
              style={{
                textAlign: 'center',
                marginBottom: '10px',
                fontSize: '12px',
                fontStyle: 'italic',
              }}
            >
            There is no game yet
            </Col>
          </Row>
        </Grid>
      );
    }

    let players = event.players.map(p => ({
      id: p.id,
      name: p.name,
      win: 0,
      lose: 0,
    }));
    for (const game of event.games) {
      for (const winner of game.winners) {
        players.find(p => p.id === winner).win += 1;
      }
      for (const loser of game.losers) {
        players.find(p => p.id === loser).lose += 1;
      }
    }

    players = players.sort((a, b) => b.win - a.win);

    return (
      <Grid>
        <blockquote>
          <b>{event.players.length}</b> players played{' '}
          <b>{event.games.length}</b> games.
        </blockquote>
        <blockquote>
          <div style={{ marginBottom: '10px' }}>
            Ranking by wins
          </div>
          <table>
            <tbody>
            {players.map(p => (
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
        </blockquote>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event,
});

export default connect(mapStateToProps)(Summary);
