import React from 'react';
import { Grid, Col, Panel, Form, FormGroup, FormControl, Checkbox } from 'react-bootstrap';
import { Line as LineChart } from 'react-chartjs';
import http from '../http';

export default class Stats extends React.Component {
  static propTypes = {
  };

  state = {
    labels: null,
    users: null,
    selected: [],
    months: 6,
    type: 'sum',
  };

  componentDidMount() {
    this.queryStats(this.state.months);
  }

  queryStats(months) {
    http.get(`/api/stats?months=${months}`)
    .then((stats) => {
      this.setState({
        labels: stats.labels,
        users: stats.users,
        selected: stats.users.map(u => u.id),
      });
    })
    .catch(() => {});
  }

  handleChangeMonths = (e) => {
    const months = parseInt(e.target.value, 10);
    this.setState({ months });
    this.queryStats(months);
  };

  handleChangeType = (e) => {
    this.setState({ type: e.target.value });
  };

  handleClickUser = (checked, id) => {
    if (checked) {
      const selected = this.state.selected.concat(id);
      this.setState({ selected });
    } else {
      const selected = this.state.selected.filter(i => i !== id);
      this.setState({ selected });
    }
  }

  render() {
    const { labels, users, selected } = this.state;
    if (!labels) {
      return <div />;
    }

    let dataFunc = null;
    switch (this.state.type) {
      case 'sum': dataFunc = d => d[0] + d[1]; break;
      case 'diff': dataFunc = d => d[0] - d[1]; break;
      case 'win': dataFunc = d => d[0]; break;
      case 'lose': dataFunc = d => d[1]; break;
      default:
    }

    const colors = [
      [255, 99, 132],
      [54, 162, 235],
      [255, 206, 86],
      [75, 192, 192],
      [153, 102, 255],
      [255, 159, 64],
    ];

    const filtered = users.filter(user => selected.includes(user.id));
    const datasets = filtered.map((user, i) => {
      const fillColor = `rgba(${colors[i % colors.length].join(',')},0.2)`;
      const strokeColor = `rgb(${colors[i % colors.length].join(',')})`;
      return {
        label: user.name,
        data: user.data.map(dataFunc),
        fillColor,
        strokeColor,
        pointColor: '#fff',
        pointStrokeColor: strokeColor,
        pointHighlightFill: strokeColor,
        pointHighlightStroke: strokeColor,
      };
    });

    const data = {
      labels,
      datasets,
    };

    const chartOptions = {
      responsive: true,
      bezierCurve: true,
      bezierCurveTension: 0.2,
    };

    return (
      <Grid>
        <Form inline>
          <FormGroup controlId="formControlsSelect">
            <FormControl
              componentClass="select"
              value={this.state.months}
              onChange={this.handleChangeMonths}
            >
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
            </FormControl>
          </FormGroup>
          {' '}
          <FormGroup controlId="formControlsSelect">
            <FormControl
              componentClass="select"
              value={this.state.type}
              onChange={this.handleChangeType}
            >
              <option value="sum">Win + Lose</option>
              <option value="diff">Win - Lose</option>
              <option value="win">Win</option>
              <option value="lose">Lose</option>
            </FormControl>
          </FormGroup>
        </Form>
        <br />
        <Panel>
          {users.map(user => (
            <Col key={user.name} xs={6} sm={4} md={3} lg={2}>
              <Checkbox
                checked={selected.includes(user.id)}
                onChange={e => this.handleClickUser(e.target.checked, user.id)}
              >
                {user.name}
              </Checkbox>
            </Col>
          ))}
        </Panel>
        <br />
        <LineChart
          data={data}
          options={chartOptions}
          redraw
        />
      </Grid>
    );
  }
}
