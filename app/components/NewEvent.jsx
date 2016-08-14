import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';

export default class NewEvent extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onClose: React.PropTypes.func,
  };

  componentDidMount() {
    const e = ReactDOM.findDOMNode(this.addEventText);
    e.focus();
  }

  handleCreate = () => {
    const e = ReactDOM.findDOMNode(this.addEventText);
    this.props.onCreate(e.value);
  };

  render() {
    return (
      <Modal show onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <FormControl
                ref={e => { this.addEventText = e; }}
                type="text"
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
