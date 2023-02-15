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
  username = "";
  move = MoveEnum.NOACTION;

  #result;
  #done = false;

  constructor(name) {
    if (name && name != "")
      this.username = name;
    else
      throw new Error('Player: Constructor() -> invalid empty username');
  }

  setMove(moveName) {
    if (!this.#done) {
      switch (moveName.toLowerCase()) {
        case "rock":
          this.move = MoveEnum.ROCK;
          break;
        case "paper":
          this.move = MoveEnum.PAPER;
          break;
        case "sicssors":
          this.move = MoveEnum.SCISSORS;
          break;
        default:
          this.move = MoveEnum.NOACTION;
          throw new Error(`Unrecognized move: ${moveName}`);
      }
      if (this.move != MoveEnum.NOACTION)
        this.#done = true;
    }
    else
      throw new Error('Player has already moved');
  }

  isDone()
  {
    return this.#done;
  }

  getResult()
  {
    return this.#result;
  }

  opponentMove(opponentMove) {
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
}

export default Player;
