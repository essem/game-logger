import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Button, Badge } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import nl2br from 'react-nl2br';
import NewEvent from './NewEvent';
import http from '../http';

class Events extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    events: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
  };

  static renderSummary(event) {
    if (!event.finished) {
      return <span>Event is in progress...<br /></span>;
    }

    return nl2br(event.summary);
  }

  static renderEvent(event) {
    const header = [];
    if (event.name) {
      header.push(<span key="name">{event.name}</span>);
    } else {
      header.push(<i key="name">noname</i>);
    }
    if (!event.finished) {
      header.push(<Badge key="inProgress" style={{ backgroundColor: '#777' }} pullRight>in progress</Badge>);
    }
    return (
      <Panel
        key={event.id}
        header={header}
        collapsible
        defaultExpanded
      >
        {Events.renderSummary(event)}
        <br />
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

  componentWillUnmount() {
    this.props.dispatch({
      type: 'RESET_EVENTS',
    });
  }

  handleLoadMore = () => {
    let params = '';
    if (this.props.events.length > 0) {
      const last = _.last(this.props.events);
      params = `?createdAt=${last.createdAt}&id=${last.id}`;
    }
    http.get(`/api/events${params}`)
    .then((events) => {
      this.props.dispatch({
        type: 'LOAD_EVENTS',
        list: events.list,
        hasMore: events.list.length > 0,
      });
    })
    .catch(() => {});
  };

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
      this.props.history.push(`/events/${res.id}/players`);
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
    const events = this.props.events;
    const loader = <div className="loader">Loading ...</div>;

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
            <InfiniteScroll
              pageStart={0}
              loadMore={this.handleLoadMore}
              hasMore={this.props.hasMore}
              loader={loader}
            >
              <div className="tracks">
                {events.map(event => Events.renderEvent(event))}
              </div>
            </InfiniteScroll>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events.list,
  hasMore: state.events.hasMore,
});

export default withRouter(connect(mapStateToProps)(Events));
