import React, { useState } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Box,
  Chip,
  Button,
  IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NewGame from './NewGame';
import Confirm from './Confirm';
import http from '../http';

export default function Games({ players, games }) {
  const event = useSelector((state) => state.event);
  const [showNewGameModal, setShowNewGameModal] = useState({ show: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false });

  const handleNewGame = (options) => {
    setShowNewGameModal({ show: true, ...options });
  };

  const handleCreateGame = (winners, losers) => {
    setShowNewGameModal({ show: false });

    http
      .post(`/api/events/${event.id}/games`, { winners, losers })
      .catch(() => {});
  };

  const handleCloseNewGameModal = () => {
    setShowNewGameModal({ show: false });
  };

  const handleDelete = (gameId) => {
    setShowDeleteConfirm({ show: true, gameId });
  };

  const handleDeleteGame = () => {
    const gameId = showDeleteConfirm.gameId;
    setShowDeleteConfirm({ show: false });

    http.delete(`/api/events/${event.id}/games/${gameId}`).catch(() => {});
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm({ show: false });
  };

  const renderGameTitle = (game) => {
    const players = event.players;
    const winners = game.winners.map(
      (id) => players.find((player) => player.id === id).user.name,
    );
    const losers = game.losers.map(
      (id) => players.find((player) => player.id === id).user.name,
    );

    return `${winners.join(', ')} vs. ${losers.join(', ')}`;
  };

  const renderNewGameModal = () => {
    if (!showNewGameModal.show) {
      return '';
    }

    return (
      <NewGame
        team={showNewGameModal.team}
        onCreate={handleCreateGame}
        onClose={handleCloseNewGameModal}
      />
    );
  };

  const renderDeleteConfirm = () => {
    if (!showDeleteConfirm.show) {
      return '';
    }

    const game = event.games.find((g) => g.id === showDeleteConfirm.gameId);

    return (
      <Confirm
        message={`Delete the game '${renderGameTitle(game)}'?`}
        okayText="Delete"
        okayColor="secondary"
        onOkay={handleDeleteGame}
        onCancel={handleCloseDeleteConfirm}
      />
    );
  };

  const renderNewGame = () => {
    if (event.finished) {
      return '';
    }

    return (
      <>
        <br />
        <Box display="flex" style={{ marginBottom: '20px' }}>
          <Box flexGrow={1}>
            <Button
              variant="contained"
              color="primary"
              style={{ width: '100%', height: '50px' }}
              onClick={() => handleNewGame({ team: false })}
            >
              New Single Game
            </Button>
          </Box>
          <Box width="20px" />
          <Box flexGrow={1}>
            <Button
              variant="contained"
              color="primary"
              style={{ width: '100%', height: '50px' }}
              onClick={() => handleNewGame({ team: true })}
            >
              New Team Game
            </Button>
          </Box>
          {renderNewGameModal()}
          {renderDeleteConfirm()}
        </Box>
      </>
    );
  };

  const renderGame = (game) => {
    let deleteButton = '';
    if (!event.finished) {
      deleteButton = (
        <IconButton
          onClick={() => handleDelete(game.id)}
          style={{ margin: '-20px -10px -20px 0px' }}
        >
          <DeleteIcon />
        </IconButton>
      );
    }

    return (
      <React.Fragment key={game.id}>
        <Paper style={{ textAlign: 'center' }}>
          <Box display="flex" alignItems="center" p={3}>
            <Box flexGrow={1}>
              <Chip size="small" label="win" /> {renderGameTitle(game)}{' '}
              <Chip size="small" label="lose" />
            </Box>
            {deleteButton}
          </Box>
        </Paper>
        <br />
      </React.Fragment>
    );
  };

  const sortedGames = event.games.sort((a, b) => b.id - a.id);

  return (
    <Container>
      {renderNewGame()}
      <Box
        style={{
          textAlign: 'center',
          margin: '20px',
          fontSize: '12px',
          fontStyle: 'italic',
        }}
      >
        Total {sortedGames.length} games
      </Box>
      <ReactCSSTransitionGroup
        transitionName="list"
        transitionEnterTimeout={600}
        transitionLeaveTimeout={600}
      >
        {sortedGames.map((game) => renderGame(game))}
      </ReactCSSTransitionGroup>
    </Container>
  );
}
