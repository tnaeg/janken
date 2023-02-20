import GameServer from '../app/game/GameServer.js';
import { StateEnum } from '../app/game/models/Game';

import { v4 as uuid, validate } from 'uuid'

describe('Create a game server', () => {
  let gameServer;

  beforeEach(() => {
    gameServer = new GameServer();
  })

  test('Create a new game without parameters', () => {
    const emptyGame = () => {
      return gameServer.addGame();
    }

    expect(emptyGame).toThrow(Error);
    expect(emptyGame).toThrow("Player: Invalid call without name object")
  })

  test('Create a new game without player', () => {
    const emptyGame = () => {
      return gameServer.addGame("#BadGameName");
    }
    expect(emptyGame).toThrow(Error);
    expect(emptyGame).toThrow("Player: Invalid call without name object")
  })

  test('Create a new game with bad playername', () => {
    const emptyGame = () => {
      return gameServer.addGame("#BadGameName", "#\"");
    }
    expect(emptyGame).toThrow(Error);
    expect(emptyGame).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers')
  })

  test('Create a new game with bad game alias but valid player', () => {
    const emptyGame = () => {
      return gameServer.addGame("#badGameName", "TestPlayer");
    }
    expect(emptyGame).toThrow(Error);
    expect(emptyGame).toThrow('Game: Game name must be a single word no spaces only a-z, 0-9')
  })

  test('Create a new game with no game alias but valid player', () => {
    const testGame = gameServer.addGame(undefined, "TestPlayer");

    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).toBeUndefined();

    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);
  })

  test('Create a new game with empty game alias but valid player', () => {
    const testGame = gameServer.addGame("", "TestPlayer");

    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).toBeUndefined();

    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);
  })

  test('Create a new game with empty game alias but valid player', () => {
    const testGame = gameServer.addGame("TestGame", "TestPlayer");

    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).toBeDefined();
    expect(testGame.gameName).toEqual("TestGame");

    expect(testGame.getGameState().state).toEqual(StateEnum.WAITING);
  })

})

describe('Test join game', () => {

  let gameServer;
  let identifier;

  beforeEach(() => {
    gameServer = new GameServer();
    const game = gameServer.addGame("TestGame", "TestPlayer");
    identifier = game.gameID;

  })

  test('Join game: empty arguments', () => {
    const joinEmpty = () => {
      return gameServer.joinGame();
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow("Supplied game id is not an active game");
  })

  test('Join game: invalid id', () => {
    const joinEmpty = () => {
      return gameServer.joinGame(1, undefined);
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow("Supplied game id is not an active game");
  })

  test('Join game: invalid player name no name', () => {
    const joinEmpty = () => {
      return gameServer.joinGame(identifier, "");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: invalid player name invalid symbols', () => {
    const joinEmpty = () => {
      return gameServer.joinGame(identifier, "#name");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: Valid join but same name', () => {
    const joinEmpty = () => {
      return gameServer.joinGame(identifier, "TestPlayer");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Game: Player name already exists in this game');
  })

  test('Join game: Valid join', () => {
    const joinState = gameServer.joinGame(identifier, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");
  })

  test('Join game: Dubble join', () => {
    const joinState = gameServer.joinGame(identifier, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");

    const dubbleJoin = () => {
      return gameServer.joinGame(identifier, "TestPlayer2");
    }

    expect(dubbleJoin).toThrow(Error);
    expect(dubbleJoin).toThrow("Supplied game is full");
  })

  test('Join game: diffrent uuid', () => {
    const withNewUUID = () => {
      return gameServer.joinGame(uuid(), "TestPlayer2");
    }

    expect(withNewUUID).toThrow(Error);
    expect(withNewUUID).toThrow('Supplied game id is not an active game');
  })
})

describe('Test getting number of active games', () => {

  let gameServer;

  beforeEach(() => {
    gameServer = new GameServer();
  });

  test('Empty server', () => {
    expect(gameServer.getActiveGames()).toEqual(0);
  });

  test('Game added', () => {
    gameServer.addGame("TestGame", "TestPlayer");
    expect(gameServer.getActiveGames()).toEqual(1);
  });

  test('Add 10 games', () => {
    for (let index = 0; index < 10; index++) {
      gameServer.addGame(undefined, "TestPlayer")
    }
    expect(gameServer.getActiveGames()).toEqual(10);
  });
});


describe('Test get game state', () => {
  let gameServer;
  const gameAlias = "TestGame";
  let gameID;

  beforeEach(() => {
    gameServer = new GameServer();
    const game = gameServer.addGame(gameAlias, "TestPlayer");
    gameID = game.gameID;
  })

  test('Get game no parameters', () => {
    const badCall = () => {
      return gameServer.getGame();
    }

    expect(badCall).toThrow(Error);
    expect(badCall).toThrow("GameController: no game with such identifier is active");
  })

  test('Get game parameter empty alias', () => {
    const badCall = () => {
      return gameServer.getGame("");
    }

    expect(badCall).toThrow(Error);
    expect(badCall).toThrow("GameController: no game with such identifier is active");
  })

  test('Get game undefined alias', () => {
    const badCall = () => {
      return gameServer.getGame(undefined);
    }

    expect(badCall).toThrow(Error);
    expect(badCall).toThrow("GameController: no game with such identifier is active");
  })

  test('Get game by uuid', () => {
    const game = gameServer.getGame(gameID);

    expect(validate(game.gameID)).toBeTruthy();
    expect(game.gameID).toEqual(gameID);
  });

  test('Get game by alias', () => {
    const game = gameServer.getGame(gameAlias);

    expect(validate(game.gameID)).toBeTruthy();
    expect(game.gameName).toEqual(gameAlias);
  });

  test("Get game by different uuid", () => {
    const withNewUUID = () => {
      return gameServer.getGame(uuid());
    }

    expect(withNewUUID).toThrow(Error);
    expect(withNewUUID).toThrow("GameController: no game with such identifier is active");
  })
});

describe('Test player moves', () => {
  let gameServer;
  const gameAlias = "TestGame";

  let gameID;

  beforeEach(() => {
    gameServer = new GameServer();
    const game = gameServer.addGame(gameAlias, "TestPlayer");
    gameID = game.gameID;


    gameServer.joinGame(gameID, "TestPlayer2");
  })

  test('Play move without any parameters', () => {
    let playEmpty = () => {
      return gameServer.playMove();
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: no game with such identifier is active");
  })

  test('Play move missing player and move', () => {
    let playEmpty = () => {
      return gameServer.playMove(gameID);
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: Player undefined does not exist");
  })

  test('Play move missing move', () => {
    let playEmpty = () => {
      return gameServer.playMove(gameID, "TestPlayer");
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("Player: Bad move, use only a single word and no spaces");
  })

  test('Play valid move: rock', () => {
    const moveState = gameServer.playMove(gameID, "TestPlayer", "rock");

    expect(moveState).toBeTruthy();
  })

  test('Play valid move: scissors', () => {
    const moveState = gameServer.playMove(gameID, "TestPlayer", "scissors");

    expect(moveState).toBeTruthy();
  })

  test('Play valid move: paper', () => {
    const moveState = gameServer.playMove(gameID, "TestPlayer", "paper");

    expect(moveState).toBeTruthy();
  })

  test('Play invalid move: lizard', () => {

    const invalidMove = () => {
      return gameServer.playMove(gameID, "TestPlayer", "lizard");
    }

    expect(invalidMove).toThrow(Error);
    expect(invalidMove).toThrow("Unrecognized move: lizard");

  })
});
















