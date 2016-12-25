import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import NewUser from './NewUser.jsx';
import http from '../http';

class Users extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    admin: React.PropTypes.bool,
    users: React.PropTypes.array,
  };

  state = {
    showNewUserModal: false,
  };

  componentDidMount() {
    http.get('/api/users')
    .then(users => {
      this.props.dispatch({
        type: 'INIT_USERS',
        users,
      });
    })
    .catch(() => {});
  }

  handleNewUser = () => {
    this.setState({ showNewUserModal: true });
  }

  handleCreateUser = (name, password) => {
    if (!name.trim()) {
      return;
    }

    this.setState({ showNewUserModal: false });

    http.post('/api/users', { name, password })
    .then(res => {
      this.props.dispatch({
        type: 'CREATE_USER',
        user: res,
      });
    })
    .catch(() => {});
  }

  handleCloseNewUserModal = () => {
    this.setState({ showNewUserModal: false });
  }

  renderNewUserModal() {
    if (!this.state.showNewUserModal) {
      return '';
    }

    return (
      <NewUser
        onCreate={this.handleCreateUser}
        onClose={this.handleCloseNewUserModal}
      />
    );
  }

  renderNewUser() {
    if (!this.props.admin) {
      return '';
    }

    return (
      <Row style={{ marginBottom: '20px' }}>
        <Col xs={12}>
          <Button
            bsStyle="primary"
            style={{ width: '100%', height: '50px' }}
            onClick={this.handleNewUser}
          >
            New User
          </Button>
          {this.renderNewUserModal()}
        </Col>
      </Row>
    );
  }

  render() {
    const users = this.props.users.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <Grid>
        {this.renderNewUser()}
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
          Total {users.length} users
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
          {users.map(user => (
            <Panel key={user.id}>
              {user.name}
            </Panel>
          ))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.app.admin,
  users: state.users,
});

export default connect(mapStateToProps)(Users);
