import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function Confirm({
  message,
  okayText,
  okayColor,
  onOkay,
  onCancel,
}) {
  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>Confirm</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onOkay} color={okayColor} autoFocus>
          {okayText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
