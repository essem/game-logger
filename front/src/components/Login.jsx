import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import http from '../http';
import { login } from '../reducers/app';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const dispatch = useDispatch();
  const [loginMessage, setLoginMessage] = useState(null);
  const history = useHistory();
  const accountEl = useRef(null);
  const passwordEl = useRef(null);
  const classes = useStyles();

  const handleLogin = async (e) => {
    e.preventDefault();
    const account = accountEl.current.value;
    const password = passwordEl.current.value;
    try {
      const res = await http.post('/api/login', { account, password });
      if (res.token) {
        dispatch(login(res.token));
        history.push('/');
      } else {
        setLoginMessage('Failed to login');
      }
    } catch (err) {}
  };

  const renderAlert = () => {
    if (!loginMessage) {
      return '';
    }

    return (
      <Typography variant="body2" align="center" color="secondary">
        {loginMessage}
      </Typography>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Account"
            inputRef={accountEl}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            inputRef={passwordEl}
            label="Password"
            type="password"
          />
          {renderAlert()}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
