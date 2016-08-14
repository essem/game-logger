import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router';

class Event extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
    children: React.PropTypes.element,
    params: React.PropTypes.object,
  };

  componentDidMount() {
    fetch(`${API_HOST}/api/event/${this.props.params.id}`)
    .then(res => res.json())
    .then(event => {
      this.props.dispatch({
        type: 'INIT_EVENT',
        event,
      });
    })
    .catch(() => {});
  }

  render() {
    const event = this.props.event;
    if (!event) {
      return <div />;
    }

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel>
                {event.name}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ButtonGroup justified>
                <Link
                  to={`/events/${event.id}/players`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Players
                </Link>
                <Link
                  to={`/events/${event.id}/games`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Games
                </Link>
                <Link
                  to={`/events/${event.id}/summary`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Summary
                </Link>
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
        <br />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event,
});

export default connect(mapStateToProps)(Event);
