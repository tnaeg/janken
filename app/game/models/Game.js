/**
  * One game consits of a unique id, 2 players
  * 2 players which have 3 actions each.
  * 
  */

import { v4 as uuid } from 'uuid';
import { validateString } from './helpValidator.js';
import Player from './Player.js';


const StateEnum = {
  WAITING: 0,
  INPROGRESS: 1,
  COMPLETED: 2
};

class Game {
  gameName;
  gameID;
  #gamePlayers;
  #gameState = StateEnum.WAITING;

  constructor(gameName, player) {
    if (gameName && gameName != "") {
      if (validateString(gameName, /^[A-Za-z0-9]+$/)) {
        this.gameName = gameName;
      }
      else
        throw new Error('Game: Game name must be a single word no spaces only a-z, 0-9');
    }

    this.gameID = uuid();

    if (player instanceof Player) {
      this.#gamePlayers = new Array();
      this.#gamePlayers.push(player);
    }
    else
      throw new Error('Game: Not allowed to create game without players');
  }

  addPlayer(player) {
    if (this.#gameState == StateEnum.WAITING && player instanceof Player) {

      //Player with same name as other player is not allowed.
      if (this.#gamePlayers[0].username == player.username) {
        throw new Error("Game: Player name already exists in this game");
      }

      this.#gamePlayers.push(player);
      this.#gameState = StateEnum.INPROGRESS;

      return { joined: true, player: player.username };
    }
    else {
      if (this.#gameState != StateEnum.WAITING)
        throw new Error('Game: Game is already full');
      else
        throw new Error('Game: Supplied player is not a real player');
    }
  }

  isGameJoinable() {
    if ((this.#gameState == StateEnum.WAITING) &&
      (this.#gamePlayers.length == 1))
      return true;

    return false;
  }

  getGameState() {

    if (this.#gameState == StateEnum.COMPLETED) {
      this.#updateResults();

      const stateObj = {
        state: this.#gameState,
        players: [
          {
            player: this.#gamePlayers[0].username,
            result: this.#gamePlayers[0].getResult(),
          },
          {
            player: this.#gamePlayers[1].username,
            result: this.#gamePlayers[1].getResult(),
          }
        ]
      };
      return stateObj;
    }
    else {
      return {
        state: this.#gameState,
        players: this.#gamePlayers.length
      };
    }
  }

  getPlayer(playerName) {
    return this.#gamePlayers.find(element => (element.username == playerName))
  }

  checkPlayerStates() {
    let playersCompleted = 0;
    this.#gamePlayers.forEach(element => {
      if (element.isDone())
        playersCompleted++;
    })

    if (playersCompleted == 2)
      this.#gameState = StateEnum.COMPLETED;
  }

  #updateResults() {
    this.#gamePlayers[0].opponentMove(this.#gamePlayers[1]);
    this.#gamePlayers[1].opponentMove(this.#gamePlayers[0]);
  }
}

export default Game;
export { StateEnum };
