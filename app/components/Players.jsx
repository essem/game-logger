import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap';
import NewPlayer from './NewPlayer.jsx';
import http from '../http';

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

    http.post(`/api/events/${this.props.event.id}/players`, { name })
    .catch(() => {});
  }

  handleCloseNewPlayerModal = () => {
    this.setState({ showNewPlayerModal: false });
  }

  handleDeletePlayer = playerId => {
    http.delete(`/api/events/${this.props.event.id}/players/${playerId}`)
    .catch(() => {});
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

  renderNewPlayer() {
    if (this.props.event.finished) {
      return '';
    }

    return (
      <Row style={{ marginBottom: '20px' }}>
        <Col xs={12}>
          <Button
            bsStyle="primary"
            style={{ width: '100%', height: '50px' }}
            onClick={this.handleNewPlayer}
          >
            New Player
          </Button>
          {this.renderNewPlayerModal()}
        </Col>
      </Row>
    );
  }

  renderPlayer(player) {
    const { event } = this.props;

    let win = 0;
    let lose = 0;
    for (const game of event.games) {
      win += game.winners.filter(id => id === player.id).length;
      lose += game.losers.filter(id => id === player.id).length;
    }

    let deleteButton = '';
    if (!event.finished && win === 0 && lose === 0) {
      deleteButton = (
        <span
          className="pull-right"
          style={{ color: '#ccc', marginLeft: '15px' }}
          onClick={() => this.handleDeletePlayer(player.id)}
        >
          <Glyphicon glyph="remove" />
        </span>
      );
    }

    return (
      <Panel
        key={player.id}
      >
        {player.name}
        <span className="pull-right">
          {win} W {lose} L
          {deleteButton}
        </span>
      </Panel>
    );
  }

  render() {
    const players = this.props.players.sort((a, b) => a.id - b.id);

    return (
      <Grid>
        {this.renderNewPlayer()}
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
          Total {players.length} players
          </Col>
        </Row>
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
