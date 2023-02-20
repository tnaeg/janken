import Game from "./models/Game.js";
import { StateEnum } from './models/Game.js'
import Player from "./models/Player.js";
import { validate } from 'uuid';

class GameController {
  #activeGames;
  #gameAlias;

  constructor() {
    //Map all game objects based on {UUID, Game}
    //Which means we can get a game based on UUID
    this.#activeGames = new Map();

    //Alias a UUID to human readable unique identifier.
    this.#gameAlias = new Map();
  }

  getActiveGames() {
    return this.#activeGames.size;
  }

  addNewGame(gameName, playerName) {
    if (this.#gameAlias.get(gameName) != undefined)
      throw new Error("Game: Game name must be unique");

    let player = new Player(playerName);
    let newGame = new Game(gameName, player);

    this.#activeGames.set(newGame.gameID, newGame);
    if (newGame.gameName != undefined)
      this.#gameAlias.set(newGame.gameName, newGame.gameID);

    return newGame;
  }

  joinGame(identifier, name) {
    if (validate(identifier)) {
      if (this.#activeGames.get(identifier) != undefined) {
        let game = this.#activeGames.get(identifier);
        if (game.isGameJoinable()) {
          const player = new Player(name);
          const playerJoinedState = game.addPlayer(player);
          return playerJoinedState;
        }
        else
          throw new Error('Supplied game is full');
      }
    }
    else {
      if (this.#gameAlias.get(identifier) != undefined) {
        //Recursive call with the found uuid
        return this.joinGame(this.#gameAlias.get(identifier), name);
      }
    }

    throw new Error('Supplied game id is not an active game');
  }

  getGame(identifier) {
    if (validate(identifier)) {
      if (this.#activeGames.get(identifier) != undefined) {
        return this.#activeGames.get(identifier);
      }
    }
    else {
      if (this.#gameAlias.get(identifier) != undefined) {
        return this.getGame(this.#gameAlias.get(identifier));
      }

    }
    throw new Error('GameController: no game with such identifier is active');
  }

  playMove(gameID, playerName, move) {
    let game = this.getGame(gameID);

    if (game.getGameState().state == StateEnum.WAITING)
      throw new Error('GameController: Game is waiting for another player');

    const player = game.getPlayer(playerName);

    if (player != undefined) {
      player.setMove(move);
    }
    else
      throw new Error(`GameController: Player ${playerName} does not exist `)

    game.checkPlayerStates();
    return true;
  }
}

export default GameController;
