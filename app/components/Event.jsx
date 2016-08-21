import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Confirm from './Confirm.jsx';

class Event extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    event: React.PropTypes.object,
    children: React.PropTypes.element,
    params: React.PropTypes.object,
  };

  state = {
    showFinishConfirm: false,
  };

  componentDidMount() {
    fetch(`${API_HOST}/api/events/${this.props.params.id}`)
    .then(res => res.json())
    .then(event => {
      this.props.dispatch({
        type: 'INIT_EVENT',
        event,
      });
    })
    .catch(() => {});
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'CLEAR_EVENT',
    });
  }

  handleConfirmFinish = () => {
    this.setState({ showFinishConfirm: true });
  };

  handleFinish = () => {
    this.setState({ showFinishConfirm: false });

    fetch(`${API_HOST}/api/events/${this.props.event.id}`, {
      method: 'put',
      body: JSON.stringify({ finished: true }),
    })
    .then(res => res.json())
    .then(() => {
      this.props.dispatch({
        type: 'FINISH_EVENT',
      });
    })
    .catch(() => {});
  }

  handleCloseFinishConfirm = () => {
    this.setState({ showFinishConfirm: false });
  }

  renderFinishConfirm() {
    if (!this.state.showFinishConfirm) {
      return '';
    }

    return (
      <Confirm
        message="Finish the event?"
        okayText="Finish"
        okayStyle="primary"
        onOkay={this.handleFinish}
        onCancel={this.handleCloseFinishConfirm}
      />
    );
  }

  render() {
    const event = this.props.event;
    if (!event) {
      return <div />;
    }

    let finishButton = '';
    if (!event.finished) {
      finishButton = (
        <Button
          bsStyle="primary"
          className="pull-right"
          onClick={this.handleConfirmFinish}
        >
          Finish
        </Button>
      );
    }

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <Panel
                style={{
                  height: '60px',
                  lineHeight: '30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                <span>{event.name}</span>
                {finishButton}
                {this.renderFinishConfirm()}
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
