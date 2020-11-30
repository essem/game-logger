import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class NewGame extends React.Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    team: PropTypes.bool.isRequired,
    onCreate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  state = {
    step: 'winner',
    winners: [],
    losers: [],
  }

  handleClickPlayer = (playerId) => {
    if (!this.props.team) {
      if (this.state.step === 'winner') {
        const winners = this.state.winners.concat(playerId);
        this.setState({ step: 'loser', winners });
      } else {
        const losers = this.state.losers.concat(playerId);
        this.props.onCreate(this.state.winners, losers);
      }
      return;
    }

    if (this.state.step === 'winner') {
      const winners = this.state.winners.concat(playerId);
      this.setState({ winners });
    } else {
      const losers = this.state.losers.concat(playerId);
      this.setState({ losers });
    }
  };

  handleNext = () => {
    if (this.state.step === 'winner') {
      this.setState({ step: 'loser' });
    } else {
      this.props.onCreate(this.state.winners, this.state.losers);
    }
  }

  renderMessage() {
    let message = '';
    if (this.state.step === 'winner') {
      message = 'Select winner';
    } else {
      message = 'Select loser';
    }

    const { players } = this.props;

    const winners = this.state.winners.map(winner => players.find(p => p.id === winner).user.name);
    const losers = this.state.losers.map(loser => players.find(p => p.id === loser).user.name);

    return (
      <Card bg="light">
        <Card.Body>
          {message}<br />
          Winner: {winners.join(', ')}<br />
          Loser: {losers.join(', ')}<br />
        </Card.Body>
      </Card>
    );
  }

  renderPlayer(player) {
    return (
      <Col key={player.id} xs={4}>
        <Button
          style={{ width: '100%', height: '50px', marginBottom: '10px' }}
          onClick={() => this.handleClickPlayer(player.id)}
        >
          {player.user.name}
        </Button>
      </Col>
    );
  }

  renderNextButton() {
    if (!this.props.team) {
      return '';
    }

    return (
      <Button
        bsStyle="primary"
        onClick={this.handleNext}
      >
        {this.state.step === 'winner' ? 'Next' : 'Done'}
      </Button>
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
          <Row>
            {players.map(player => this.renderPlayer(player))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
          {this.renderNextButton()}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  players: state.event.players,
});

export default connect(mapStateToProps)(NewGame);
