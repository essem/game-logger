import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';

class Summary extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
  };

  render() {
    let players = this.props.event.players.map(p => ({
      id: p.id,
      name: p.name,
      win: 0,
      lose: 0,
    }));
    for (const game of this.props.event.games) {
      players.find(p => p.id === game.winnerId).win += 1;
      players.find(p => p.id === game.loserId).lose += 1;
    }

    players = players.sort((a, b) => b.win - a.win);

    return (
      <Grid>
        <blockquote>
          <b>{this.props.event.players.length}</b> players played{' '}
          <b>{this.props.event.games.length}</b> games.
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
