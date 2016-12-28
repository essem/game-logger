import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import http from '../http';

class NewPlayer extends React.Component {
  static propTypes = {
    players: React.PropTypes.array,
    onCreate: React.PropTypes.func,
    onClose: React.PropTypes.func,
  };

  state = {
    users: [],
    selectedUsers: new Set(),
  }

  componentDidMount() {
    http.get('/api/users')
    .then((users) => {
      this.setState({ users });
    })
    .catch(() => {});
  }

  handleClickUser = (userId) => {
    const selectedUsers = new Set(this.state.selectedUsers);
    if (this.state.selectedUsers.has(userId)) {
      selectedUsers.delete(userId);
    } else {
      selectedUsers.add(userId);
    }
    this.setState({ selectedUsers });
  };

  handleCreate = (e) => {
    e.preventDefault();
    this.props.onCreate(Array.from(this.state.selectedUsers));
  };

  renderUser(user) {
    return (
      <Col key={user.id} xs={4}>
        <Button
          style={{ width: '100%', height: '50px', marginBottom: '10px' }}
          active={this.state.selectedUsers.has(user.id)}
          onClick={() => this.handleClickUser(user.id)}
        >
          {user.name}
        </Button>
      </Col>
    );
  }

  render() {
    let users = this.state.users;
    users = users.filter(u => !_.some(this.props.players, p => p.user.id === u.id));
    users = users.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <Modal show onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {users.map(user => this.renderUser(user))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.props.onClose}
          >
            Cancel
          </Button>
          <Button
            bsStyle="primary"
            onClick={this.handleCreate}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  players: state.event.players,
});

export default connect(mapStateToProps)(NewPlayer);
