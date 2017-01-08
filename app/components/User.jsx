import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { withRouter } from 'react-router';
import _ from 'lodash';
import http from '../http';

class User extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    user: React.PropTypes.object,
  };

  componentDidMount() {
    const userId = parseInt(this.props.params.id, 10);
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
    const win = user.games.reduce((n, g) =>
      n + (_.includes(g.winners, user.id) && _.includes(g.losers, other)), 0);
    const lose = user.games.reduce((n, g) =>
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
    const others = users.filter(u => u !== user.id);
    return (
      <blockquote key={user.id}>
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

  render() {
    const user = this.props.user;
    if (!user) {
      return <div />;
    }

    const win = user.games.reduce((n, g) => n + _.includes(g.winners, user.id), 0);
    const lose = user.games.reduce((n, g) => n + _.includes(g.losers, user.id), 0);

    return (
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
              <span>{user.name}</span>
            </Panel>
          </Col>
        </Row>
        <blockquote>
          Total <b>{win}</b> Win <b>{lose}</b> Lose
        </blockquote>
        {this.renderAgainstEachOther()}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.app.admin,
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(User));
