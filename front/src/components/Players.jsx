import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper, Box, Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NewPlayer from './NewPlayer';
import http from '../http';

export default function Players() {
  const event = useSelector((state) => state.event);
  const [showNewPlayerModal, setShowNewPlayerModal] = useState(false);

  const handleNewPlayer = () => {
    setShowNewPlayerModal(true);
  };

  const handleCreatePlayer = (users) => {
    setShowNewPlayerModal(false);

    http.post(`/api/events/${event.id}/players`, { users }).catch(() => {});
  };

  const handleCloseNewPlayerModal = () => {
    setShowNewPlayerModal(false);
  };

  const handleDeletePlayer = (playerId) => {
    http.delete(`/api/events/${event.id}/players/${playerId}`).catch(() => {});
  };

  const renderNewPlayerModal = () => {
    if (!showNewPlayerModal) {
      return '';
    }

    return (
      <NewPlayer
        onCreate={handleCreatePlayer}
        onClose={handleCloseNewPlayerModal}
      />
    );
  };

  const renderNewPlayer = () => {
    if (event.finished) {
      return '';
    }

    return (
      <>
        <br />
        <Button
          variant="contained"
          color="primary"
          style={{ width: '100%', height: '50px' }}
          onClick={handleNewPlayer}
        >
          New Player
        </Button>
        {renderNewPlayerModal()}
      </>
    );
  };

  const renderPlayer = (player) => {
    let win = 0;
    let lose = 0;
    for (const game of event.games) {
      win += game.winners.filter((id) => id === player.id).length;
      lose += game.losers.filter((id) => id === player.id).length;
    }

    let deleteButton = '';
    if (!event.finished && win === 0 && lose === 0) {
      deleteButton = (
        <IconButton
          onClick={() => handleDeletePlayer(player.id)}
          style={{ margin: '-20px -10px -20px 0px' }}
        >
          <DeleteIcon />
        </IconButton>
      );
    }

    return (
      <React.Fragment key={player.id}>
        <Paper>
          <Box display="flex" alignItems="center" p={3}>
            <Box flexGrow={1}>{player.user.name}</Box>
            <Box>
              {win} W {lose} L
            </Box>
            <Box>{deleteButton}</Box>
          </Box>
        </Paper>
        <br />
      </React.Fragment>
    );
  };

  const players = event.players
    ? event.players.sort((a, b) => a.id - b.id)
    : [];

  return (
    <Container>
      {renderNewPlayer()}
      <Box
        style={{
          textAlign: 'center',
          margin: '20px',
          fontSize: '12px',
          fontStyle: 'italic',
        }}
      >
        Total {players.length} players
      </Box>
      {players.map((player) => renderPlayer(player))}
    </Container>
  );
}
