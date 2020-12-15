import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

export default function NewGame({ team, onCreate, onClose }) {
  const players = useSelector((state) => state.event.players);
  const [step, setStep] = useState('winner');
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);

  const handleClickPlayer = (playerId) => {
    if (!team) {
      if (step === 'winner') {
        setWinners(winners.concat(playerId));
        setStep('loser');
      } else {
        onCreate(winners, losers.concat(playerId));
      }
      return;
    }

    if (step === 'winner') {
      setWinners(winners.concat(playerId));
    } else {
      setLosers(losers.concat(playerId));
    }
  };

  const handleNext = () => {
    if (step === 'winner') {
      setStep('loser');
    } else {
      onCreate(winners, losers);
    }
  };

  const renderMessage = () => {
    let message = '';
    if (step === 'winner') {
      message = 'Select winner';
    } else {
      message = 'Select loser';
    }

    const winnerNames = winners.map(
      (winner) => players.find((p) => p.id === winner).user.name,
    );
    const loserNames = losers.map(
      (loser) => players.find((p) => p.id === loser).user.name,
    );

    return (
      <Box>
        {message}
        <br />
        Winner: {winnerNames.join(', ')}
        <br />
        Loser: {loserNames.join(', ')}
        <br />
      </Box>
    );
  };

  const renderPlayer = (player) => {
    return (
      <Button
        key={player.id}
        variant={
          winners.includes(player.id) || losers.includes(player.id)
            ? 'contained'
            : 'outlined'
        }
        color="primary"
        style={{ margin: '10px' }}
        onClick={() => handleClickPlayer(player.id)}
      >
        {player.user.name}
      </Button>
    );
  };

  const renderNextButton = () => {
    if (!team) {
      return '';
    }

    return (
      <Button onClick={handleNext} color="primary">
        {step === 'winner' ? 'Next' : 'Done'}
      </Button>
    );
  };

  const sortedPlayers = players.sort((a, b) => a.id - b.id);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New Game</DialogTitle>
      <DialogContent>
        <Box>{renderMessage()}</Box>
        {sortedPlayers.map((player) => renderPlayer(player))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {renderNextButton()}
      </DialogActions>
    </Dialog>
  );
}
