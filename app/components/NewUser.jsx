import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class NewUser extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onClose: React.PropTypes.func,
  };

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.addUserName);
    input.focus();
  }

  handleCreate = e => {
    e.preventDefault();
    const name = ReactDOM.findDOMNode(this.addUserName);
    const password = ReactDOM.findDOMNode(this.addUserPassword);
    this.props.onCreate(name.value, password.value);
  };

  render() {
    return (
      <Modal show onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleCreate}>
            <FormGroup>
              <ControlLabel>Account</ControlLabel>
              <FormControl
                ref={e => { this.addUserName = e; }}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                ref={e => { this.addUserPassword = e; }}
                type="password"
              />
            </FormGroup>
          </Form>
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
