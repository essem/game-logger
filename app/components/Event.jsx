import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import Confirm from './Confirm.jsx';

class Event extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    admin: React.PropTypes.bool,
    event: React.PropTypes.object,
    children: React.PropTypes.element,
    params: React.PropTypes.object,
  };

  state = {
    showFinishConfirm: false,
    wsState: 'offline',
  };

  componentDidMount() {
    const eventId = parseInt(this.props.params.id, 10);
    fetch(`${API_HOST}/api/events/${eventId}`)
    .then(res => res.json())
    .then(event => {
      this.props.dispatch({
        type: 'INIT_EVENT',
        event,
      });

      if (!event.finished) {
        this.wsConnect();
      }
    })
    .catch(() => {});
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.onclose = () => {};
      this.socket.close();
    }
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
    }
    this.props.dispatch({
      type: 'CLEAR_EVENT',
    });
  }

  wsConnect = () => {
    const eventId = parseInt(this.props.params.id, 10);
    let wsHost = WS_HOST;
    if (wsHost === '') {
      const loc = window.location;
      const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
      wsHost = `${protocol}//${loc.host}`;
    }

    this.socket = new WebSocket(wsHost, 'watch');
    this.socket.onopen = () => {
      this.setState({ wsState: 'online' });
      this.socket.send(JSON.stringify({ type: 'watch', eventId }));
      this.socket.onmessage = e => this.handleSocketMessage(e.data);
      this.socket.onclose = () => {
        this.setState({ wsState: 'offline' }, () => this.wsReconnect());
      };
    };
  };

  wsReconnect = () => {
    if (this.state.wsState === 'online') {
      return;
    }

    this.wsReconnectTimer = setTimeout(this.wsReconnect, 2000);
    this.wsConnect();
  };

  handleSocketMessage(data) {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'createGame':
        this.props.dispatch({
          type: 'CREATE_GAME',
          game: message.game,
        });
        break;
      case 'deleteGame':
        this.props.dispatch({
          type: 'DELETE_GAME',
          id: message.gameId,
        });
        break;
      case 'createPlayer':
        this.props.dispatch({
          type: 'CREATE_PLAYER',
          player: message.player,
        });
        break;
      default:
    }
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

  handleReopen = () => {
    fetch(`${API_HOST}/api/events/${this.props.event.id}`, {
      credentials: 'include',
      method: 'put',
      body: JSON.stringify({ finished: false }),
    })
    .then(res => res.json())
    .then(() => {
      this.props.dispatch({
        type: 'REOPEN_EVENT',
      });
      this.wsConnect();
    })
    .catch(() => {});
  }

  renderWsBadge() {
    if (this.props.event.finished) {
      return '';
    }

    const wsStateBgColor = this.state.wsState === 'online' ? 'green' : 'red';

    return (
      <Badge
        style={{
          marginLeft: '10px',
          backgroundColor: wsStateBgColor,
        }}
      >
        {this.state.wsState}
      </Badge>
    );
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
    } else if (this.props.admin) {
      finishButton = (
        <Button
          bsStyle="primary"
          className="pull-right"
          onClick={this.handleReopen}
        >
          Re-open
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
                {this.renderWsBadge()}
                {finishButton}
                {this.renderFinishConfirm()}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ButtonGroup justified style={{ height: '50px' }}>
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
  admin: state.app.admin,
  event: state.event,
});

export default connect(mapStateToProps)(Event);
