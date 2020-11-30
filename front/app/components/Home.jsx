import React from 'react';
import { Grid, Jumbotron } from 'react-bootstrap';

export default class Home extends React.Component {
  render() {
    return (
      <Grid>
        <Jumbotron>
          <h1>Game Logger</h1>
          <p>
            This is a simple logger for games.
            Register players and enter games,
            then the statistics will be calculated.
          </p>
        </Jumbotron>
      </Grid>
    );
  }
}