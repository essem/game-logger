import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Spinner from 'react-spin';

class Topbar extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object,
    account: React.PropTypes.string,
    loading: React.PropTypes.bool,
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Ask to server if token is valid
      this.props.dispatch({
        type: 'LOGIN',
        token,
      });
    }
  }

  handleLogout = () => {
    this.props.dispatch({
      type: 'LOGOUT',
    });
    this.props.router.push('/');
  };

  renderLogin() {
    if (this.props.account) {
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
            <Nav pullRight>
              {this.renderLogin()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
        {this.props.loading ? <div className="loading"><Spinner /></div> : ''}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.app.account,
  loading: state.app.loading,
});

export default withRouter(connect(mapStateToProps)(Topbar));
