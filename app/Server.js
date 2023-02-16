
import express, { json } from 'express';
import {createGame, joinGame, getGame, playMove } from './routes/AddGameRoute.js';

const app = express();

import GameServer from './game/GameServer.js';

const gameServer = new GameServer();
app.use(json());

    app.get('/', (req, res) => {
      res.contentType('text/plain');
      res.statusCode = 200;
      res.end("Welcome to the rock-paper-scissors server");
    })

    app.post('/api/games/', (req, res) => {
      createGame(req, res, gameServer);
    });

    app.post('/api/games/:id/join', (req, res) => {
      joinGame(req, res, gameServer);
    });

    app.post('/api/games/:id/move', (req, res) => {
      playMove(req, res, gameServer);
    });

    app.get('/api/games/:id', (req, res) => {
      getGame(req, res, gameServer);
    });


const _app = app;
export {_app as app};
