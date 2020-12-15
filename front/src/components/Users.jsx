import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import NewUser from './NewUser';
import http from '../http';

export default function Users() {
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const admin = useSelector((state) => state.app.admin);
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    http
      .get('/api/users')
      .then((users) => {
        dispatch({
          type: 'INIT_USERS',
          users,
        });
      })
      .catch(() => {});
  }, [dispatch]);

  const handleNewUser = () => {
    setShowNewUserModal(true);
  };

  const handleCreateUser = (name, password) => {
    if (!name.trim()) {
      return;
    }

    setShowNewUserModal(false);

    http
      .post('/api/users', { name, password })
      .then((res) => {
        dispatch({
          type: 'CREATE_USER',
          user: res,
        });
      })
      .catch(() => {});
  };

  const handleCloseNewUserModal = () => {
    setShowNewUserModal(false);
  };

  const renderNewUserModal = () => {
    if (!showNewUserModal) {
      return '';
    }

    return (
      <NewUser onCreate={handleCreateUser} onClose={handleCloseNewUserModal} />
    );
  };

  const renderNewUser = () => {
    if (!admin) {
      return '';
    }

    return (
      <Grid item xs={12} style={{ marginBottom: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          style={{ width: '100%', height: '50px' }}
          onClick={handleNewUser}
        >
          New User
        </Button>
        {renderNewUserModal()}
      </Grid>
    );
  };

  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container>
      <Grid container>
        {renderNewUser()}
        <Grid container item xs={12}>
          <Grid
            item
            xs={12}
            style={{
              textAlign: 'center',
              marginBottom: '10px',
              fontSize: '12px',
              fontStyle: 'italic',
            }}
          >
            Total {sortedUsers.length} users
          </Grid>
        </Grid>
        {sortedUsers.map((user) => (
          <Grid
            container
            item
            xs={12}
            key={user.id}
            style={{ marginBottom: '10px' }}
          >
            <Grid item xs={12}>
              <Button
                variant="contained"
                to={`/users/${user.id}`}
                component={RouterLink}
                style={{ width: '100%', textAlign: 'left' }}
              >
                {user.name}
              </Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
