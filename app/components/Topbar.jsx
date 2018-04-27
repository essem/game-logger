import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import Home from './Home';
import Login from './Login';
import Events from './Events';
import Event from './Event';
import Users from './Users';
import User from './User';
import Stats from './Stats';
import LoadingSpinner from './LoadingSpinner';

class Topbar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    checkToken: PropTypes.bool.isRequired,
    account: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const token = localStorage.getItem('token');

    // TODO: Ask to server if token is valid
    this.props.dispatch({
      type: 'LOGIN',
      token,
    });
  }

  handleLogout = () => {
    this.props.dispatch({
      type: 'LOGOUT',
    });
    this.props.history.push('/');
  };

  renderLogin() {
    if (this.props.account !== '') {
      return (
        <NavDropdown title={this.props.account} id="login">
          <MenuItem onClick={this.handleLogout}>
            Logout
          </MenuItem>
        </NavDropdown>
      );
    }

    return (
      <LinkContainer to="/login">
        <NavItem>Login</NavItem>
      </LinkContainer>
    );
  }

  render() {
    if (this.props.checkToken) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Game Logger</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/events">
                <NavItem>Events</NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/users">
                <NavItem>Users</NavItem>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/stats">
                <NavItem>Statistics</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              {this.renderLogin()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/events" component={Events} />
        <Route path="/events/:id" component={Event} />
        <Route exact path="/users" component={Users} />
        <Route path="/users/:id" component={User} />
        <Route exact path="/stats" component={Stats} />

        <LoadingSpinner />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  checkToken: state.app.checkToken,
  account: state.app.account,
});

export default withRouter(connect(mapStateToProps)(Topbar));
