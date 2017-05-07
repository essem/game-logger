import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel, Badge, ButtonGroup, Button, ButtonToolbar } from 'react-bootstrap';
import { withRouter, Route, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Confirm from './Confirm';
import http from '../http';
import Players from './Players';
import Games from './Games';
import Summary from './Summary';

class Event extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    admin: PropTypes.bool,
    event: PropTypes.object,
    match: PropTypes.object.isRequired,
  };

  static defaultProps = {
    admin: false,
    event: undefined,
  };

  state = {
    showFinishConfirm: false,
    showDeleteConfirm: false,
    wsState: 'offline',
  };

  componentDidMount() {
    const eventId = parseInt(this.props.match.params.id, 10);
    http.get(`/api/events/${eventId}`)
    .then((event) => {
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
    const eventId = parseInt(this.props.match.params.id, 10);
    let wsHost = WS_HOST;
    if (wsHost === '') {
      const loc = window.location;
      const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
      wsHost = `${protocol}//${loc.host}${SUB_URI}/`;
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

  wsClose = () => {
    this.socket.onclose = () => {};
    this.socket.close();
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
      case 'createPlayers':
        this.props.dispatch({
          type: 'CREATE_PLAYERS',
          players: message.players,
        });
        break;
      case 'deletePlayer':
        this.props.dispatch({
          type: 'DELETE_PLAYER',
          id: message.playerId,
        });
        break;
      case 'finish':
        this.props.dispatch({
          type: 'FINISH_EVENT',
        });
        this.wsClose();
        break;
      default:
    }
  }

  handleConfirmFinish = () => {
    this.setState({ showFinishConfirm: true });
  };

  handleFinish = () => {
    this.setState({ showFinishConfirm: false });

    http.put(`/api/events/${this.props.event.id}/finish`)
    .catch(() => {});
  }

  handleCloseFinishConfirm = () => {
    this.setState({ showFinishConfirm: false });
  }

  handleReopen = () => {
    http.put(`/api/events/${this.props.event.id}/reopen`)
    .then(() => {
      this.props.dispatch({
        type: 'REOPEN_EVENT',
      });
      this.wsConnect();
    })
    .catch(() => {});
  }

  handleConfirmDelete = () => {
    this.setState({ showDeleteConfirm: true });
  };

  handleDelete = () => {
    this.setState({ showDeleteConfirm: false });

    http.delete(`/api/events/${this.props.event.id}`)
    .then((res) => {
      this.props.dispatch({
        type: 'DELETE_EVENT',
        id: res.id,
      });
      this.props.history.push('/events');
    })
    .catch(() => {});
  }

  handleCloseDeleteConfirm = () => {
    this.setState({ showDeleteConfirm: false });
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

  renderDeleteConfirm() {
    if (!this.state.showDeleteConfirm) {
      return '';
    }

    return (
      <Confirm
        message="Delete the event?"
        okayText="Delete"
        okayStyle="danger"
        onOkay={this.handleDelete}
        onCancel={this.handleCloseDeleteConfirm}
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
          disabled={this.props.event.games.length === 0}
          onClick={this.handleConfirmFinish}
        >
          Finish
        </Button>
      );
    } else if (this.props.admin) {
      finishButton = (
        <ButtonToolbar className="pull-right">
          <Button
            bsStyle="primary"
            onClick={this.handleReopen}
          >
            Re-open
          </Button>
          <Button
            bsStyle="danger"
            onClick={this.handleConfirmDelete}
          >
            Delete
          </Button>
        </ButtonToolbar>
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
                {this.renderDeleteConfirm()}
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ButtonGroup justified style={{ height: '50px' }}>
                <NavLink
                  to={`/events/${event.id}/players`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Players
                </NavLink>
                <NavLink
                  to={`/events/${event.id}/games`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Games
                </NavLink>
                <NavLink
                  to={`/events/${event.id}/summary`}
                  className="btn btn-default"
                  activeClassName="active"
                >
                  Summary
                </NavLink>
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
        <br />
        <Route exact path={`${this.props.match.url}/players`} component={Players} />
        <Route exact path={`${this.props.match.url}/games`} component={Games} />
        <Route exact path={`${this.props.match.url}/summary`} component={Summary} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.app.admin,
  event: state.event,
});

export default withRouter(connect(mapStateToProps)(Event));
