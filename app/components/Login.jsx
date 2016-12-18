import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Panel, Button, FormGroup, ControlLabel,
  Form, FormControl, Alert } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import http from '../http';

class Login extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
  };

  state = {
    loginMessage: null,
  };

  handleLogin = e => {
    e.preventDefault();
    const account = ReactDOM.findDOMNode(this.account).value;
    const password = ReactDOM.findDOMNode(this.password).value;
    http.post('/api/login', { account, password })
    .then(res => {
      if (res.token) {
        this.props.dispatch({
          type: 'LOGIN',
          token: res.token,
        });
        browserHistory.push('/');
      } else {
        this.setState({ loginMessage: 'Failed to login' });
      }
    })
    .catch(() => {});
  };

  renderAlert() {
    if (!this.state.loginMessage) {
      return '';
    }

    return (
      <Alert bsStyle="danger">
        {this.state.loginMessage}
      </Alert>
    );
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col lg={4} md={4} sm={8} xs={12}>
            <Panel>
              {this.renderAlert()}
              <Form onSubmit={this.handleLogin}>
                <FormGroup>
                  <ControlLabel>Account</ControlLabel>
                  <FormControl
                    type="text"
                    autoFocus
                    ref={e => { this.account = e; }}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    type="password"
                    ref={e => { this.password = e; }}
                  />
                </FormGroup>
                <Button
                  type="submit"
                  bsStyle="primary"
                  onClick={this.handleLogin}
                >
                  Login
                </Button>
              </Form>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  account: state.app.account,
});

export default connect(mapStateToProps)(Login);
