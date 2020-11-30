import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';
import NewGame from './NewGame';
import Confirm from './Confirm';
import http from '../http';

class Games extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    games: PropTypes.array.isRequired,
  };

  state = {
    showNewGameModal: { show: false },
    showDeleteConfirm: false,
  };

  handleNewGame = (options) => {
    this.setState({ showNewGameModal: { show: true, ...options } });
  }

  handleCreateGame = (winners, losers) => {
    this.setState({ showNewGameModal: { show: false } });

    http.post(`/api/events/${this.props.event.id}/games`,
      { winners, losers })
    .catch(() => {});
  }

  handleCloseNewGameModal = () => {
    this.setState({ showNewGameModal: { show: false } });
  }

  handleDelete = (gameId) => {
    this.setState({ showDeleteConfirm: true, deleteGameId: gameId });
  };

  handleDeleteGame = () => {
    const gameId = this.state.deleteGameId;

    this.setState({ showDeleteConfirm: false, deleteGameId: null });

    http.delete(`/api/events/${this.props.event.id}/games/${gameId}`)
    .catch(() => {});
  }

  handleCloseDeleteConfirm = () => {
    this.setState({ showDeleteConfirm: false, deleteGameId: null });
  }

  renderGameTitle(game) {
    const players = this.props.players;
    const winners = game.winners.map(id => players.find(player => player.id === id).user.name);
    const losers = game.losers.map(id => players.find(player => player.id === id).user.name);

    return `${winners.join(', ')} vs. ${losers.join(', ')}`;
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
      <Row style={{ marginBottom: '20px' }}>
        <Col xs={6}>
          <Button
            bsStyle="primary"
            style={{ width: '100%', height: '50px' }}
            onClick={() => this.handleNewGame({ team: false })}
          >
            New Single Game
          </Button>
        </Col>
        <Col xs={6}>
          <Button
            bsStyle="primary"
            style={{ width: '100%', height: '50px' }}
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
      const style = {
        color: '#ccc',
        background: 'none',
        border: 'none',
        padding: 0,
      };

      deleteButton = (
        <button
          className="pull-right"
          style={style}
          onClick={() => this.handleDelete(game.id)}
        >
          <X />
        </button>
      );
    }

    return (
      <Card
        key={game.id}
        style={{ textAlign: 'center' }}
      >
        <Badge>win</Badge> {this.renderGameTitle(game)} <Badge>lose</Badge>
        {deleteButton}
      </Card>
    );
  }

  render() {
    const games = this.props.games.sort((a, b) => b.id - a.id);

    return (
      <Container>
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
            <ReactCSSTransitionGroup
              transitionName="list"
              transitionEnterTimeout={600}
              transitionLeaveTimeout={600}
            >
              {games.map(game => this.renderGame(game))}
            </ReactCSSTransitionGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event,
  players: state.event.players,
  games: state.event.games,
});

export default connect(mapStateToProps)(Games);