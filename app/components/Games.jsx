import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Badge, Glyphicon } from 'react-bootstrap';
import NewGame from './NewGame.jsx';
import Confirm from './Confirm.jsx';

class Games extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
    players: React.PropTypes.array,
    games: React.PropTypes.array,
  };

  state = {
    showNewGameModal: false,
    showDeleteConfirm: false,
  };

  handleNewGame = () => {
    this.setState({ showNewGameModal: true });
  }

  handleCreateGame = (winnerId, loserId) => {
    this.setState({ showNewGameModal: false });

    fetch(`${API_HOST}/api/events/${this.props.event.id}/games`, {
      method: 'post',
      body: JSON.stringify({ winnerId, loserId }),
    })
    .then(res => res.json())
    .then(res => {
      this.props.dispatch({
        type: 'CREATE_GAME',
        game: res,
      });
    })
    .catch(() => {});
  }

  handleCloseNewGameModal = () => {
    this.setState({ showNewGameModal: false });
  }

  handleDelete = gameId => {
    this.setState({ showDeleteConfirm: true, deleteGameId: gameId });
  };

  handleDeleteGame = () => {
    const gameId = this.state.deleteGameId;

    this.setState({ showDeleteConfirm: false, deleteGameId: null });

    fetch(`${API_HOST}/api/events/${this.props.event.id}/games/${gameId}`, {
      method: 'delete',
    })
    .then(res => res.json())
    .then(res => {
      this.props.dispatch({
        type: 'DELETE_GAME',
        id: res.id,
      });
    })
    .catch(() => {});
  }

  handleCloseDeleteConfirm = () => {
    this.setState({ showDeleteConfirm: false, deleteGameId: null });
  }

  renderNewGameModal() {
    if (!this.state.showNewGameModal) {
      return '';
    }

    return (
      <NewGame
        onCreate={this.handleCreateGame}
        onClose={this.handleCloseNewGameModal}
      />
    );
  }

  renderDeleteConfirm() {
    if (!this.state.showDeleteConfirm) {
      return '';
    }

    const game = this.props.games.find(g => g.id === this.state.deleteGameId);
    const winner = this.props.players.find(player => player.id === game.winnerId);
    const loser = this.props.players.find(player => player.id === game.loserId);

    return (
      <Confirm
        message={`Delete the game '${winner.name} vs ${loser.name}'?`}
        okayText="Delete"
        okayStyle="danger"
        onOkay={this.handleDeleteGame}
        onCancel={this.handleCloseDeleteConfirm}
      />
    );
  }

  renderNewGame() {
    if (this.props.event.finished) {
      return '';
    }

    return (
      <Row style={{ marginBottom: '30px' }}>
        <Col xs={12}>
          <Button
            bsStyle="primary"
            style={{ width: '100%' }}
            onClick={this.handleNewGame}
          >
            New Game
          </Button>
          {this.renderNewGameModal()}
          {this.renderDeleteConfirm()}
        </Col>
      </Row>
    );
  }

  renderGame(game) {
    const winner = this.props.players.find(player => player.id === game.winnerId);
    const loser = this.props.players.find(player => player.id === game.loserId);

    let deleteButton = '';
    if (!this.props.event.finished) {
      deleteButton = (
        <span
          className="pull-right"
          style={{ color: '#ccc' }}
          onClick={() => this.handleDelete(game.id)}
        >
          <Glyphicon glyph="remove" />
        </span>
      );
    }

    return (
      <Panel
        key={game.id}
        style={{ textAlign: 'center' }}
      >
        <Badge>win</Badge> {winner.name} vs {loser.name} <Badge>lose</Badge>
        {deleteButton}
      </Panel>
    );
  }

  render() {
    const games = this.props.games.sort((a, b) => b.id - a.id);

    return (
      <Grid>
        {this.renderNewGame()}
        <Row>
          <Col xs={12}>
          {games.map(game => this.renderGame(game))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event,
  players: state.event.players,
  games: state.event.games,
});

export default connect(mapStateToProps)(Games);
