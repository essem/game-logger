import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import { withRouter, Link } from 'react-router';
import NewEvent from './NewEvent';
import http from '../http';

class Events extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object,
    events: React.PropTypes.array,
  };

  static renderSummary(event) {
    if (!event.finished) {
      return <span>Event is in progress...<br /></span>;
    }

    return event.summary.split('\n').map((item, i) => (
      <span key={i}>
        {item}
        <br />
      </span>
    ));
  }

  static renderEvent(event) {
    return (
      <Panel
        key={event.id}
        header={event.name || '(noname)'}
        collapsible
        defaultExpanded={false}
      >
        {Events.renderSummary(event)}
        <br />
        <Link to={`/events/${event.id}/summary`} className="btn btn-default">
          View
        </Link>
      </Panel>
    );
  }

  state = {
    showNewEventModal: false,
  };

  componentDidMount() {
    http.get('/api/events')
    .then((events) => {
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

  handleCreateEvent = (name) => {
    if (!name.trim()) {
      return;
    }

    this.setState({ showNewEventModal: false });

    http.post('/api/events', { name })
    .then((res) => {
      this.props.dispatch({
        type: 'CREATE_EVENT',
        event: res,
      });
      this.props.router.push(`/events/${res.id}/players`);
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

  render() {
    const events = this.props.events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return (
      <Grid>
        <Row style={{ marginBottom: '20px' }}>
          <Col xs={12}>
            <Button
              bsStyle="primary"
              style={{ width: '100%', height: '50px' }}
              onClick={this.handleNewEvent}
            >
              New Event
            </Button>
            {this.renderNewEventModal()}
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            style={{
              textAlign: 'center',
              marginBottom: '10px',
              fontSize: '12px',
              fontStyle: 'italic',
            }}
          >
          Total {events.length} events
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {events.map(event => Events.renderEvent(event))}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
});

export default withRouter(connect(mapStateToProps)(Events));
