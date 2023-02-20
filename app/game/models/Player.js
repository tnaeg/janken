import { validateString } from './helpValidator.js';
const MoveEnum = {
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
  NOACTION: -1
};

const ResultEnum = {
  TIE: 0,
  WINNER: 1,
  LOOSER: -1
};


class Player {
  username;
  move;

  #result;
  #done = false;

  constructor(name) {
    if (name != undefined && name != "" && validateString(name, /^[A-Za-z0-9]+$/)) {
      this.username = name;
    }
    else {
      if (name == undefined) {
        throw new Error('Player: Invalid call without name object');
      }
      else {
        throw new Error('Player: Empty/Invalid username, no spaces and only letters and numbers');
      }
    }

    this.move = MoveEnum.NOACTION;
  }

  setMove(moveName) {
    if (!validateString(moveName, /^[A-Za-z]+$/) || moveName == undefined)
      throw new Error('Player: Bad move, use only a single word and no spaces')
    if (!this.#done) {
      switch (moveName.toLowerCase()) {
        case "rock":
          this.move = MoveEnum.ROCK;
          this.#done = true;
          break;
        case "paper":
          this.move = MoveEnum.PAPER;
          this.#done = true;
          break;
        case "scissors":
          this.move = MoveEnum.SCISSORS;
          this.#done = true;
          break;
        default:
          this.move = MoveEnum.NOACTION;
          throw new Error(`Unrecognized move: ${moveName}`);
      };

    }
    else
      throw new Error('Player has already moved');
  }

  isDone() {
    return this.#done;
  }

  getResult() {
    return this.#result;
  }

  opponentMove(opponent) {
    if (opponent instanceof Player) {
      let opponentMove = opponent.move;

      switch (this.move) {
        case MoveEnum.ROCK:
          {
            if (opponentMove == MoveEnum.ROCK)
              this.#result = ResultEnum.TIE;
            else if (opponentMove == MoveEnum.PAPER)
              this.#result = ResultEnum.LOOSER;
            else
              this.#result = ResultEnum.WINNER;
          }
          break;
        case MoveEnum.PAPER:
          {
            if (opponentMove == MoveEnum.PAPER)
              this.#result = ResultEnum.TIE;
            else if (opponentMove == MoveEnum.ROCK)
              this.#result = ResultEnum.WINNER;
            else
              this.#result = ResultEnum.LOOSER;
          }
          break;
        case MoveEnum.SCISSORS:
          {
            if (opponentMove == MoveEnum.SCISSORS)
              this.#result = ResultEnum.TIE;
            else if (opponentMove == MoveEnum.PAPER)
              this.#result = ResultEnum.WINNER;
            else
              this.#result = ResultEnum.LOOSER;
          }
          break;
        default:
          throw new Error('Player move invalid');
      }
    }
    else
      throw new Error("Not a valid player for this game");
  }
}

export default Player;

export { MoveEnum, ResultEnum };
