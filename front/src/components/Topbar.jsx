import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EventIcon from '@material-ui/icons/Event';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import PeopleIcon from '@material-ui/icons/People';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Route, Link as RouterLink } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Events from './Events';
import Event from './Event';
import Users from './Users';
import User from './User';
import Stats from './Stats';
import LoadingSpinner from './LoadingSpinner';
import { login, logout } from '../reducers/app';

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  login: {
    '&:hover': {
      color: 'white',
    },
  },
}));

export default function Topbar() {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const checkToken = useSelector((state) => state.app.checkToken);
  const account = useSelector((state) => state.app.account);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // TODO: Ask to server if token is valid
    dispatch(login(token));
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    history.push('/');
  };

  const renderLogin = () => {
    if (account !== '') {
      return (
        <>
          <Button
            className={classes.login}
            color="inherit"
            onClick={handleMenu}
          >
            {account}
          </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <Button
        component={RouterLink}
        to="/login"
        className={classes.login}
        color="inherit"
      >
        Login
      </Button>
    );
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItemLink to="/events" primary="Events" icon={<EventIcon />} />
        <ListItemLink to="/users" primary="Users" icon={<PeopleIcon />} />
        <ListItemLink
          to="/stats"
          primary="Statistics"
          icon={<ShowChartIcon />}
        />
      </List>
    </div>
  );

  if (checkToken) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {/* TODO: Link to root page */}
          <Typography variant="h6" className={classes.title} noWrap>
            Game Logger
          </Typography>
          {renderLogin()}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/events" component={Events} />
        <Route path="/events/:id" component={Event} />
        <Route exact path="/users" component={Users} />
        <Route path="/users/:id" component={User} />
        <Route exact path="/stats" component={Stats} />

        <LoadingSpinner />
      </main>
    </div>
  );
}
