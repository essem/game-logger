# Game logger

Simple logger for games. Register players and enter games, then the statistics will be calculated.

## Screenshot

![screenshot-players](/docs/screenshot-file-players.png?raw=true)
![screenshot-games](/docs/screenshot-file-games.png?raw=true)
![screenshot-summary](/docs/screenshot-file-summary.png?raw=true)
![screenshot-stats](/docs/screenshot-file-stats.png?raw=true)

## Run

### Development environment (Docker)

Start back-end node server.
```bash
docker-compose up
```

Run following command in another terminal
```bash
docker-compose exec back npm run migrate
```

Open your browser and connect to http://localhost:5001.
