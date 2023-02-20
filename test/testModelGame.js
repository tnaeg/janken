import Game, { StateEnum } from '../app/game/models/Game.js';
import Player from '../app/game/models/Player.js';
import { validate } from 'uuid';

describe("Test creating a game", () => {
  const gameName = "TestGame";
  const gameCreator = "Tester1";

  test("Create a game without parameters, should throw", () => {
    const testGame = () => {
      return new Game();
    };
    expect(testGame).toThrow(Error);
    expect(testGame).toThrow("Game: Not allowed to create game without player");
  });

  test("Create a game lacking player, should throw", () => {
    const testGame = () => {
      return new Game(gameName);
    };
    expect(testGame).toThrow(Error);
  });

  test("Create a game with invalid name only a space, should throw", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = () => {
      return new Game(" ", testPlayer);
    };
    expect(testGame).toThrow(Error);
    expect(testGame).toThrow("Game: Game name must be a single word no spaces only a-z, 0-9");
  });

  test("Create a game with invalid name with a space, should throw", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = () => {
      return new Game("Test Game", testPlayer);
    };
    expect(testGame).toThrow(Error);
    expect(testGame).toThrow("Game: Game name must be a single word no spaces only a-z, 0-9");
  });

  test("Create a game with invalid name symbols, should throw", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = () => {
      return new Game("#\"", testPlayer);
    };
    expect(testGame).toThrow(Error);
    expect(testGame).toThrow("Game: Game name must be a single word no spaces only a-z, 0-9");
  });

  test("Create a game with empty name, should have undefined name", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = new Game("", testPlayer);

    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).not.toBeDefined();
  });

  test("Create a game with player, should give uuid", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = new Game(undefined, testPlayer);
    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).not.toBeDefined();
  })

  test("Should create game with TestUser, TestGame parameters", () => {
    const testPlayer = new Player(gameCreator);

    const testGame = new Game(gameName, testPlayer);
    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).toEqual(gameName);
  });

  test("New game state should be waiting and player count 1", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = new Game(gameName, testPlayer);

    const gameState = testGame.getGameState();

    expect(gameState.state).toEqual(StateEnum.WAITING);
    expect(gameState.players).toEqual(1);
  });

  test("New game should be joinable", () => {
    const testPlayer = new Player(gameCreator);
    const testGame = new Game(gameName, testPlayer);

    expect(testGame.isGameJoinable()).toBeTruthy();
  });

});

describe('Test add player', () => {
  let testPlayer;
  let testGame;

  beforeEach(() => {
    testPlayer = new Player("TestPlayer");
    testGame = new Game("TestGame", testPlayer);
  });

  test('Add empty player', () => {
    const testAdd = () => {
      return testGame.addPlayer();
    };

    expect(testAdd).toThrow(Error);
    expect(testAdd).toThrow("Game: Supplied player is not a real player");
  });

  test('Add player', () => {
    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);
    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);

    const gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);
    expect(gameState.players).toEqual(2);
  });

  test('Add player with same name as creator, should throw', () => {
    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);

    const addSamePlayer = () => {
      return testGame.addPlayer(testPlayer);
    };

    expect(addSamePlayer).toThrow(Error);
    expect(addSamePlayer).toThrow("Game: Player name already exists in this game");
  });

  test('Add 2 players, should throw', () => {
    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);
    expect(testGame.getGameState().players).toEqual(1);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);

    const gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);
    expect(gameState.players).toEqual(2);

    const testAddPlayer = () => {
      return testGame.addPlayer(testPlayer2);
    };

    expect(testAddPlayer).toThrow(Error);
    expect(testAddPlayer).toThrow("Game: Game is already full");
  });

  test('2 Player game should not be joinable', () => {
    expect(testGame.isGameJoinable()).toEqual(true);
    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    expect(testGame.isGameJoinable()).toEqual(false);
  });
});

describe('Test all viable game states', () => {
  let testPlayer;
  let testGame;
  let gameState;

  beforeEach(() => {
    testPlayer = new Player("TestPlayer");
    testGame = new Game("TestGame", testPlayer);

    gameState = testGame.getGameState();
  });

  test('Game is wating for players', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);
  });

  test('Game with player is in progress until both have played a move', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    gameState = testGame.getGameState();

    expect(gameState.state).toEqual(StateEnum.INPROGRESS);
  });

  test('Complete a game: player rock vs scissors', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    gameState = testGame.getGameState();

    testGame.checkPlayerStates();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);


    testPlayer.setMove("rock");
    testPlayer2.setMove("scissors");

    testGame.checkPlayerStates();

    gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.COMPLETED);

  });

  test('Complete a game: player rock vs paper', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    gameState = testGame.getGameState();

    testGame.checkPlayerStates();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);


    testPlayer.setMove("rock");
    testPlayer2.setMove("paper");

    testGame.checkPlayerStates();

    gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.COMPLETED);

  });

  test('Complete a game: player scissors vs paper', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    gameState = testGame.getGameState();

    testGame.checkPlayerStates();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);

    testPlayer.setMove("scissors");
    testPlayer2.setMove("paper");

    testGame.checkPlayerStates();

    gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.COMPLETED);

  });

  test('Complete a game: player rock vs rock', () => {
    expect(gameState.state).toEqual(StateEnum.WAITING);

    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);
    gameState = testGame.getGameState();

    testGame.checkPlayerStates();
    expect(gameState.state).toEqual(StateEnum.INPROGRESS);


    testPlayer.setMove("rock");
    testPlayer2.setMove("paper");

    testGame.checkPlayerStates();

    gameState = testGame.getGameState();
    expect(gameState.state).toEqual(StateEnum.COMPLETED);
  })
});

describe('Get players that are part of a game', () => {
  let testPlayer;
  let testGame;
  beforeEach(() => {
    testPlayer = new Player("TestPlayer");
    testGame = new Game("TestGame", testPlayer);
  })

  test('Get player 1', () => {
    expect(testGame.getPlayer("TestPlayer")).toEqual(testPlayer);
  })

  test('Get Player 2', () => {
    const testPlayer2 = new Player("TestPlayer2");
    testGame.addPlayer(testPlayer2);

    expect(testGame.getPlayer("TestPlayer2")).toEqual(testPlayer2);
  })

  test('Get Player not in game', () => {
    expect(testGame.getPlayer("TestPlayer2")).not.toBeDefined();
  })
})
