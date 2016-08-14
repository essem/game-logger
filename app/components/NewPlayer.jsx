import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Form, FormGroup, FormControl } from 'react-bootstrap';

export default class NewPlayer extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onClose: React.PropTypes.func,
  };

  componentDidMount() {
    const e = ReactDOM.findDOMNode(this.addPlayerText);
    e.focus();
  }

  handleCreate = () => {
    const e = ReactDOM.findDOMNode(this.addPlayerText);
    this.props.onCreate(e.value);
  };

  render() {
    return (
      <Modal show onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <FormControl
                ref={e => { this.addPlayerText = e; }}
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
