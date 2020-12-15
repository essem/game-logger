import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: '50px',
  },
});

export default function Home() {
  const classes = useStyles();

  return (
    <Container>
      <Paper className={classes.root}>
        <Typography variant="h3">Game Logger</Typography>
        <Typography variant="body1">
          This is a simple logger for games. Register players and enter games,
          then the statistics will be calculated.
        </Typography>
      </Paper>
    </Container>
  );
}
