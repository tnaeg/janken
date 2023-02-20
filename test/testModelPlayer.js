import { MoveEnum, ResultEnum } from "../app/game/models/Player";
import Player from '../app/game/models/Player.js';


describe("Test empty constructor call", () => {
  test("Should throw error", () => {
    const testPlayer = () => {
      return new Player();
    };
    expect(testPlayer).toThrow(Error);
  });
});

describe("Test empty playername", () => {
  test("Should throw error for no name", () => {
    const testPlayer = () => {
      return new Player("");
    };
    expect(testPlayer).toThrow(Error);
  });
});

describe("Test create player A", () => {
  test("Create a player named A", () => {
    const testPlayer = new Player("A");
    expect(testPlayer.username).toBe("A");
    expect(testPlayer.move).toBe(MoveEnum.NOACTION);
  })
})

describe("Test player does empty move", () => {
  test("Player plays a no move", () => {
    const testPlayer = new Player("A");

    const badMove = () => {
      return testPlayer.setMove("");
    };
    expect(badMove).toThrow(Error);
  })
})

describe("Test player does bad move", () => {
  test("Player plays a bad move", () => {
    const testPlayer = new Player("A");

    const badMove = () => {
      return testPlayer.setMove("lizard");
    };
    expect(badMove).toThrow(Error);
  })
})

describe("Test player moves", () => {
  test("Player plays rock", () => {
    const testPlayer = new Player("A");
    testPlayer.setMove("rock");
    expect(testPlayer.move).toBe(MoveEnum.ROCK);

  });

  test("Player plays scissors", () => {
    const testPlayer = new Player("A");
    testPlayer.setMove("scissors");
    expect(testPlayer.move).toBe(MoveEnum.SCISSORS);

  });

  test("Player plays paper", () => {
    const testPlayer = new Player("A");
    testPlayer.setMove("paper");
    expect(testPlayer.move).toBe(MoveEnum.PAPER);

  });

  test("Bad input", () => {
    const testPlayer = new Player("A");
    const badMoveSpace = () => {
      return testPlayer.setMove(" ");
    };

    const badMoveSymbols = () => {
      return testPlayer.setMove("r0ck!");
    };

    const badMoveNumbers = () => {
      return testPlayer.setMove("4037");
    }

    expect(badMoveSpace).toThrow(Error);
    expect(badMoveSymbols).toThrow(Error);
    expect(badMoveNumbers).toThrow(Error);
  })

  test("Player does two moves, should throw", () => {
    const testPlayer = new Player("A");

    const dubbleMove = () => {
      testPlayer.setMove("rock");
      expect(testPlayer.isDone()).toBe(true);
      testPlayer.setMove("paper");
    };

    expect(dubbleMove).toThrow(Error);
  })
});

describe("Test player results", () => {
  test("New player, no play result yet", () => {
    const testPlayer = new Player("A");
    expect(testPlayer.getResult()).toBe(undefined);
  });

  test("Player tie", () => {
    const testPlayer1 = new Player("A");
    testPlayer1.setMove("rock");
    testPlayer1.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer1.isDone()).toBe(true);
  });

  test("Paper beets Rock", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("paper");
    testPlayer2.setMove("rock");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.WINNER);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.LOOSER);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("Rock beets Scissors", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("rock");
    testPlayer2.setMove("scissors");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.WINNER);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.LOOSER);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("Scissors beets paper", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("scissors");
    testPlayer2.setMove("paper");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.WINNER);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.LOOSER);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("Scissors tie against Scissors", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("scissors");
    testPlayer2.setMove("scissors");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("rock tie against rock", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("rock");
    testPlayer2.setMove("rock");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("Paper tie against Paper", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    testPlayer1.setMove("paper");
    testPlayer2.setMove("paper");
    testPlayer1.opponentMove(testPlayer2);
    testPlayer2.opponentMove(testPlayer1);

    expect(testPlayer1.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer1.isDone()).toBe(true);
    expect(testPlayer2.getResult()).toBe(ResultEnum.TIE);
    expect(testPlayer2.isDone()).toBe(true);
  });

  test("Player 1 player 2 has not", () => {
    const testPlayer1 = new Player("A");
    const testPlayer2 = new Player("B");

    const t = () => {
      testPlayer1.opponentMove(testPlayer2);
    };
    expect(t).toThrow(Error);
  });

  test("Setting non player as move", () => {
    const testPlayer1 = new Player("A");
    const testNoObj = () => {
      testPlayer1.opponentMove();
    };

    expect(testNoObj).toThrow(Error);
  })

  test("No action played yet", () => {
    const testPlayer1 = new Player("A");
    expect(testPlayer1.isDone()).toBe(false);

    testPlayer1.setMove("rock");
    expect(testPlayer1.isDone()).toBe(true);
  })



});





