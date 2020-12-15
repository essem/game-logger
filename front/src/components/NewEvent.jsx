import React, { useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import moment from 'moment';

function EventNameTextField({ inputRef }) {
  useEffect(() => {
    inputRef.current.value = moment().format('YYYY-MM-DD HH:mm:ss');
    inputRef.current.select();
  }, [inputRef]);
  return (
    <TextField
      label="Name"
      inputRef={inputRef}
      autoFocus
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}

export default function NewEvent({ onCreate, onClose }) {
  const eventTextEl = useRef(null);

  const handleCreate = (e) => {
    e.preventDefault();
    onCreate(eventTextEl.current.value);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New Event</DialogTitle>
      <DialogContent>
        <form onSubmit={handleCreate}>
          <Box mb={2}>
            <EventNameTextField inputRef={eventTextEl} />
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
