import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import http from '../http';

export default function NewPlayer({ onCreate, onClose }) {
  const players = useSelector((state) => state.event.players);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  useEffect(() => {
    http
      .get('/api/users')
      .then((users) => {
        setUsers(users);
      })
      .catch(() => {});
  }, []);

  const handleClickUser = (userId) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    onCreate(Array.from(selectedUsers));
  };

  const renderUser = (user) => {
    return (
      <Button
        key={user.id}
        variant={selectedUsers.has(user.id) ? 'contained' : 'outlined'}
        color="primary"
        style={{ margin: '10px' }}
        onClick={() => handleClickUser(user.id)}
      >
        {user.name}
      </Button>
    );
  };

  const filteredUsers = users.filter(
    (u) => !_.some(players, (p) => p.user.id === u.id),
  );
  const sortedUsers = filteredUsers.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New Player</DialogTitle>
      <DialogContent>
        {sortedUsers.map((user) => renderUser(user))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" autoFocus>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
