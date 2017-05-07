import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default class Confirm extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    okayText: PropTypes.string.isRequired,
    okayStyle: PropTypes.string.isRequired,
    onOkay: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
