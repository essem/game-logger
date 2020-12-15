import React, { useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

export default function NewUser({ onCreate, onClose }) {
  const userNameEl = useRef(null);
  const passwordEl = useRef(null);

  const handleCreate = (e) => {
    e.preventDefault();
    onCreate(userNameEl.current.value, passwordEl.current.value);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleCreate}>
          <Box mb={2}>
            <TextField
              label="Account"
              inputRef={userNameEl}
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box>
            <TextField
              label="Password"
              inputRef={passwordEl}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
