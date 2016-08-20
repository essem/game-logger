import React from 'react';
import { connect } from 'react-redux';
import { Well, Row, Col, Button, Modal } from 'react-bootstrap';

class NewGame extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    players: React.PropTypes.array,
    onCreate: React.PropTypes.func,
    onClose: React.PropTypes.func,
  };

  state = {
    winnerId: null,
  }

  handleClickPlayer = playerId => {
    if (!this.state.winnerId) {
      this.setState({ winnerId: playerId });
      return;
    }

    this.props.onCreate(this.state.winnerId, playerId);
  };

  renderMessage() {
    if (!this.state.winnerId) {
      return <Well>Select winner</Well>;
    }

    const winner = this.props.players.find(player => player.id === this.state.winnerId);

    return (
      <Well>
        Winner: {winner.name}<br />
        Select loser
      </Well>
    );
  }

  renderPlayer(player) {
    return (
      <Row key={player.id}>
        <Col xs={12}>
          <Button
            style={{ width: '100%', marginBottom: '10px' }}
            onClick={() => this.handleClickPlayer(player.id)}
          >
            {player.name}
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const players = this.props.players.sort((a, b) => a.id - b.id);

    return (
      <Modal show onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              {this.renderMessage()}
            </Col>
          </Row>
          {players.map(player => this.renderPlayer(player))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  players: state.event.players,
});

export default connect(mapStateToProps)(NewGame);
