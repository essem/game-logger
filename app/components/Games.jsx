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
    showNewGameModal: { show: false },
    showDeleteConfirm: false,
  };

  handleNewGame = options => {
    this.setState({ showNewGameModal: { show: true, ...options } });
  }

  handleCreateGame = (winners, losers) => {
    this.setState({ showNewGameModal: { show: false } });

    fetch(`${API_HOST}/api/events/${this.props.event.id}/games`, {
      method: 'post',
      body: JSON.stringify({ winners, losers }),
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
    this.setState({ showNewGameModal: { show: false } });
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

  renderGameTitle(game) {
    const players = this.props.players;
    const winners = game.winners.map(id => players.find(player => player.id === id).name);
    const losers = game.losers.map(id => players.find(player => player.id === id).name);

    return `${winners.join(', ')} vs ${losers.join(', ')}`;
  }

  renderNewGameModal() {
    if (!this.state.showNewGameModal.show) {
      return '';
    }

    return (
      <NewGame
        team={this.state.showNewGameModal.team}
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

    return (
      <Confirm
        message={`Delete the game '${this.renderGameTitle(game)}'?`}
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
        <Col xs={6}>
          <Button
            bsStyle="primary"
            style={{ width: '100%' }}
            onClick={() => this.handleNewGame({ team: false })}
          >
            New Single Game
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            bsStyle="primary"
            style={{ width: '100%' }}
            onClick={() => this.handleNewGame({ team: true })}
          >
            New Team Game
          </Button>
        </Col>
        {this.renderNewGameModal()}
        {this.renderDeleteConfirm()}
      </Row>
    );
  }

  renderGame(game) {
    const { event } = this.props;

    let deleteButton = '';
    if (!event.finished) {
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
        <Badge>win</Badge> {this.renderGameTitle(game)} <Badge>lose</Badge>
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
          <Col
            xs={12}
            style={{
              textAlign: 'center',
              marginBottom: '10px',
              fontSize: '12px',
              fontStyle: 'italic',
            }}
          >
          Total {games.length} games
          </Col>
        </Row>
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
