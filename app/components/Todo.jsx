import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export default class Todo extends React.Component {
  static propTypes = {
    id: React.PropTypes.number,
    text: React.PropTypes.string,
    completed: React.PropTypes.bool,
    onClick: React.PropTypes.func,
  };

  handleClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    const { id, text, completed } = this.props;

    return (
      <div key={id} onClick={this.handleClick}>
        <Glyphicon glyph={completed ? 'check' : 'unchecked'} /> {text}
      </div>
    );
  }
}
