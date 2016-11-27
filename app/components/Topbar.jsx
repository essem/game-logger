import React from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Home extends React.Component {
  static propTypes = {
    children: React.PropTypes.element,
    dispatch: React.PropTypes.func,
    account: React.PropTypes.string,
  };

  handleLogout = () => {
    fetch(`${API_HOST}/api/logout`, {
      method: 'post',
    })
    .then(() => {
      this.props.dispatch({
        type: 'LOGOUT',
      });
      browserHistory.push('/');
    })
    .catch(() => {});
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
            <Nav pullRight>
              {this.renderLogin()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.app.account,
});

export default connect(mapStateToProps)(Home);
