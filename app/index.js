import express, { json } from 'express';

import { createGame, joinGame, getGame, playMove } from './routes/AddGameRoute.js';
import GameServer from './game/GameServer.js';

var port = 3000;
if (process.argv.length > 2) {
  port = process.argv[2];
  console.log("Using arugment port");
}
const gameServer = new GameServer();
const app = express();
app.use(json());

app.post('/api/games/', (req, res) => {
  createGame(req, res, gameServer);
})

app.post('/api/games/:id/join', async (req, res) => {
  joinGame(req, res, gameServer);
})

app.post('/api/games/:id/move', (req, res) => {
  playMove(req, res, gameServer);
})

app.get('/api/games/:id', (req, res) => {
  getGame(req, res, gameServer);
})


app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});


