import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class NewUser extends React.Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.addUserName);
    input.focus();
  }

  handleCreate = (e) => {
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
              <Form.Label>Account</Form.Label>
              <FormControl
                ref={(e) => { this.addUserName = e; }}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>Password</Form.Label>
              <FormControl
                ref={(e) => { this.addUserPassword = e; }}
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
