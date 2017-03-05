import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default class Confirm extends React.Component {
  static propTypes = {
    message: React.PropTypes.string.isRequired,
    okayText: React.PropTypes.string.isRequired,
    okayStyle: React.PropTypes.string.isRequired,
    onOkay: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <Modal show onHide={this.props.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.message}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.props.onCancel}
          >
            Cancel
          </Button>
          <Button
            bsStyle={this.props.okayStyle}
            onClick={this.props.onOkay}
          >
            {this.props.okayText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
