import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import NewPlayer from './NewPlayer.jsx';

class Players extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
    players: React.PropTypes.array,
  };

  state = {
    showNewPlayerModal: false,
  };

  handleNewPlayer = () => {
    this.setState({ showNewPlayerModal: true });
  }

  handleCreatePlayer = name => {
    if (!name.trim()) {
      return;
    }

    this.setState({ showNewPlayerModal: false });

    fetch(`${API_HOST}/api/events/${this.props.event.id}/players`, {
      method: 'post',
      body: JSON.stringify({ name }),
    })
    .then(res => res.json())
    .then(res => {
      this.props.dispatch({
        type: 'CREATE_PLAYER',
        player: res,
      });
    })
    .catch(() => {});
  }

  handleCloseNewPlayerModal = () => {
    this.setState({ showNewPlayerModal: false });
  }

  renderNewPlayerModal() {
    if (!this.state.showNewPlayerModal) {
      return '';
    }

    return (
      <NewPlayer
        onCreate={this.handleCreatePlayer}
        onClose={this.handleCloseNewPlayerModal}
      />
    );
  }

  renderPlayer(player) {
    let win = 0;
    let lose = 0;
    for (const game of this.props.event.games) {
      if (game.winnerId === player.id) {
        ++win;
      } else if (game.loserId === player.id) {
        ++lose;
      }
    }
    return (
      <Panel
        key={player.id}
      >
        {player.name}
        <span className="pull-right">
          {win} W {lose} L
        </span>
      </Panel>
    );
  }

  render() {
    const players = this.props.players.sort((a, b) => a.id - b.id);

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              style={{ width: '100%' }}
              onClick={this.handleNewPlayer}
            >
              New Player
            </Button>
            {this.renderNewPlayerModal()}
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
          {players.map(player => this.renderPlayer(player))}
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  event: state.event,
  players: state.event.players,
});

export default connect(mapStateToProps)(Players);
