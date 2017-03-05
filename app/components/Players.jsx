import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Glyphicon } from 'react-bootstrap';
import NewPlayer from './NewPlayer';
import http from '../http';

class Players extends React.Component {
  static propTypes = {
    event: React.PropTypes.object.isRequired,
    players: React.PropTypes.array.isRequired,
  };

  state = {
    showNewPlayerModal: false,
  };

  handleNewPlayer = () => {
    this.setState({ showNewPlayerModal: true });
  }

  handleCreatePlayer = (users) => {
    this.setState({ showNewPlayerModal: false });

    http.post(`/api/events/${this.props.event.id}/players`, { users })
    .catch(() => {});
  }

  handleCloseNewPlayerModal = () => {
    this.setState({ showNewPlayerModal: false });
  }

  handleDeletePlayer = (playerId) => {
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
      const style = {
        color: '#ccc',
        background: 'none',
        border: 'none',
        padding: 0,
        marginLeft: '15px',
      };

      deleteButton = (
        <button
          className="pull-right"
          style={style}
          onClick={() => this.handleDeletePlayer(player.id)}
        >
          <Glyphicon glyph="remove" />
        </button>
      );
    }

    return (
      <Panel
        key={player.id}
      >
        {player.user.name}
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
