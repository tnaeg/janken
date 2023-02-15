/**
  * One game consits of a unique id, 2 players
  * 2 players which have 3 actions each.
  * 
  */

import { v4 as uuid } from 'uuid';
import Player from './Player.js';

const StateEnum = {
  Waiting: 0,
  InProgress: 1,
  Completed: 2
};

class Game {
  gameName = "";
  gameID;
  #gamePlayers;
  #gameState = StateEnum.Waiting;

  constructor(gameName, player) {
    this.gameName = gameName;
    this.gameID = uuid();
    this.#gamePlayers = new Array();

    if (player instanceof Player)
      this.#gamePlayers.push(player);
    else
      throw new Error('Game: -> Not allowed to create game without players');
    this.#validate();
  }

  #validate() {
    if ((!this.gameName || this.gameName === "") ||
      (this.#gamePlayers.empty))
      throw new Error('Game: -> invalid username/gamename');
  }

  addPlayer(player) {
    if (this.#gameState == StateEnum.Waiting && player instanceof Player) {

      //Player with same name as other player is not allowed.
      if (this.#gamePlayers.length == 1)
      {
        if (this.#gamePlayers[0].username == player.username)
          throw new Error("Game: Player name already exists in this game");
      }

      this.#gamePlayers.push(player);
      this.#gameState = StateEnum.InProgress;

      return {joined: true, player: player.username};
    }
    else
      throw new Error('Game: -> player may not join a game that is complete or in progress');
  }

  isGameJoinable() {
    if ((this.#gameState == StateEnum.Waiting) &&
      (this.#gamePlayers.length == 1))
      return true;

    return false;
  }

  getGameState() {

    if (this.#gameState == StateEnum.Completed) {
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
        players: this.#gamePlayers
      };
    }
  }

  isPlayer(player) {
    this.#gamePlayers.forEach(element => {
      if (player == element.username)
        return true;
    });
    return false;
  }

  getPlayer(playerName) {
    let playerObj = undefined;
    this.#gamePlayers.forEach(element => {

      if (playerName == element.username) {
        return playerObj = element;
      }
    });

    return playerObj;
  }

  checkPlayerStates() {
    let playersCompleted = 0;
    this.#gamePlayers.forEach(element => {
      if (element.isDone())
        playersCompleted++;
    })

    if (playersCompleted == 2)
      this.#gameState = StateEnum.Completed;
  }

  #updateResults() {
    this.#gamePlayers[0].opponentMove(this.#gamePlayers[1]);
    this.#gamePlayers[1].opponentMove(this.#gamePlayers[0]);
  }
}

export default Game;
