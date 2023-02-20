import GameController from './GameController.js';
import Game from './models/Game.js';
import Player from './models/Player.js';


class GameServer {
  #gameController;

  constructor() {
    this.#gameController = new GameController();
  }

  addGame(gameName, playerName) {
    return this.#gameController.addNewGame(gameName, playerName);
  }

  joinGame(game, id) {
    return this.#gameController.joinGame(game, id);
  }

  getActiveGames() {
    return this.#gameController.getActiveGames();
  }

  getGame(gameID) {
    return this.#gameController.getGame(gameID);
  }

  playMove(gameID, playerName, move) {
    return this.#gameController.playMove(gameID, playerName, move);
  }
}


export default GameServer;
