import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import moment from 'moment';
import NewEvent from './NewEvent.jsx';

class Events extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    events: React.PropTypes.array,
  };

  state = {
    showNewEventModal: false,
  };

  componentDidMount() {
    fetch(`${API_HOST}/api/events`)
    .then(res => res.json())
    .then(events => {
      this.props.dispatch({
        type: 'INIT_EVENTS',
        events,
      });
    })
    .catch(() => {});
  }

  handleNewEvent = () => {
    this.setState({ showNewEventModal: true });
  }

  handleCreateEvent = name => {
    if (!name.trim()) {
      return;
    }

    this.setState({ showNewEventModal: false });

    fetch(`${API_HOST}/api/events`, {
      method: 'post',
      body: JSON.stringify({ name }),
    })
    .then(res => res.json())
    .then(res => {
      this.props.dispatch({
        type: 'CREATE_EVENT',
        event: res,
      });
    })
    .catch(() => {});
  }

  handleCloseNewEventModal = () => {
    this.setState({ showNewEventModal: false });
  }

  renderNewEventModal() {
    if (!this.state.showNewEventModal) {
      return '';
    }

    return (
      <NewEvent
        onCreate={this.handleCreateEvent}
        onClose={this.handleCloseNewEventModal}
      />
    );
  }

  renderEvent(event) {
    return (
      <Panel
        key={event.id}
        header={event.name}
        collapsible
        defaultExpanded={false}
      >
        43 Games at {moment(event.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        <br />
        Winner: essem, Loser: messe
      </Panel>
    );
  }

  render() {
    const events = this.props.events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              style={{ width: '100%' }}
              onClick={this.handleNewEvent}
            >
              New Event
            </Button>
            {this.renderNewEventModal()}
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={12}>
          {events.map(event => this.renderEvent(event))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
});

export default connect(mapStateToProps)(Events);
