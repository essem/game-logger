import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import http from '../http';

class User extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    user: PropTypes.object,
  };

  static defaultProps = {
    user: undefined,
  };

  componentDidMount() {
    const userId = parseInt(this.props.match.params.id, 10);
    http.get(`/api/users/${userId}`)
    .then((user) => {
      this.props.dispatch({
        type: 'INIT_USER',
        user,
      });
    })
    .catch(() => {});
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'CLEAR_USER',
    });
  }

  renderAgainstOther(other) {
    const user = this.props.user;
    const games = _.flatMap(user.events, event => event.games);
    const win = games.reduce((n, g) =>
      n + (_.includes(g.winners, user.id) && _.includes(g.losers, other)), 0);
    const lose = games.reduce((n, g) =>
      n + (_.includes(g.winners, other) && _.includes(g.losers, user.id)), 0);

    if (win === 0 && lose === 0) {
      return <tr key={other} />;
    }

    return (
      <tr key={other}>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{win}</b> W
        </td>
        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
          <b>{lose}</b> L
        </td>
        <td>vs. {user.users[other]}</td>
      </tr>
    );
  }

  renderAgainstEachOther() {
    const user = this.props.user;
    const users = Object.keys(user.users).map(u => parseInt(u, 10));
    let others = users.filter(u => u !== user.id);
    others = _.sortBy(others, u => user.users[u]);
    return (
      <blockquote>
        <div style={{ marginBottom: '10px' }}>
          vs. Others
        </div>
        <table>
          <tbody>
            {others.map(other => this.renderAgainstOther(other))}
          </tbody>
        </table>
      </blockquote>
    );
  }

  renderEvent(event) {
    const user = this.props.user;
    const win = event.games.reduce((n, g) => n + _.includes(g.winners, user.id), 0);
    const lose = event.games.reduce((n, g) => n + _.includes(g.losers, user.id), 0);
    const style = { paddingRight: '10px' };
    return (
      <tr key={event.id}>
        <td style={style}>
          <Link to={`/events/${event.id}/summary`}>{event.name}</Link>
        </td>
        <td style={style}><b>{win}</b> Win</td>
        <td><b>{lose}</b> Lose</td>
      </tr>
    );
  }

  renderEvents() {
    const user = this.props.user;
    const events = _.sortBy(user.events, e => -e.id);
    return (
      <blockquote>
        <div style={{ marginBottom: '10px' }}>
          Events
        </div>
        <table>
          <tbody>
            {events.map(event => this.renderEvent(event))}
          </tbody>
        </table>
      </blockquote>
    );
  }

  render() {
    const user = this.props.user;
    if (!user) {
      return <div />;
    }

    const games = _.flatMap(user.events, event => event.games);
    const win = games.reduce((n, g) => n + _.includes(g.winners, user.id), 0);
    const lose = games.reduce((n, g) => n + _.includes(g.losers, user.id), 0);

    return (
      <Container>
        <Row>
          <Col xs={12}>
            <Card
              style={{
                height: '60px',
                lineHeight: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              <span>{user.name}</span>
            </Card>
          </Col>
        </Row>
        <blockquote>
          Total <b>{win}</b> Win <b>{lose}</b> Lose
        </blockquote>
        {this.renderAgainstEachOther()}
        {this.renderEvents()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.app.admin,
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(User));
