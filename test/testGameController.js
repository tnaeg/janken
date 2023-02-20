import GameController from '../app/game/GameController.js';

import { v4 as uuid, validate } from 'uuid';

describe('Test creating a game controller', () => {
  test('Constructor expected no games at start', () => {
    const gameController = new GameController();
    expect(gameController.getActiveGames()).toEqual(0);
  });
});

describe('Test creating a new game to controller', () => {
  let gameController;

  beforeEach(() => {
    gameController = new GameController();
  })

  test('Add game: no arguments', () => {
    const addEmpty = () => {
      return gameController.addNewGame();
    };
    expect(addEmpty).toThrow(Error);
    expect(addEmpty).toThrow('Player: Invalid call without name object');
  });

  test('Add game: missing gamename arguments', () => {
    const addEmpty = () => {
      return gameController.addNewGame("TestPlayer");
    };
    expect(addEmpty).toThrow(Error);
    expect(addEmpty).toThrow('Player: Invalid call without name object');
  });

  test('Add game: empty player name', () => {
    const addEmpty = () => {
      return gameController.addNewGame(undefined, "");
    };
    expect(addEmpty).toThrow(Error);
    expect(addEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  });

  test('Add game: invalid player name', () => {
    const addEmpty = () => {
      return gameController.addNewGame(undefined, "#Name");
    };
    expect(addEmpty).toThrow(Error);
    expect(addEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  });

  test('Add game: valid player name', () => {
    const testGame = gameController.addNewGame(undefined, "TestPlayer");

    expect(gameController.getActiveGames()).toEqual(1);
    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).not.toBeDefined();
  });

  test('Add game: Game name and player name', () => {
    const gameName = "TestGame";
    const testPlayerName = "TestPlayer";
    const testGame = gameController.addNewGame(gameName, testPlayerName);

    expect(gameController.getActiveGames()).toEqual(1);
    expect(validate(testGame.gameID)).toBeTruthy();
    expect(testGame.gameName).toBeDefined();
    expect(testGame.gameName).toEqual(gameName);
  })

  test('Add game: Invalid game name', () => {
    const gameName = "TestGame ";
    const testPlayerName = "TestPlayer";

    let testGame = () => {
      return gameController.addNewGame(gameName, testPlayerName);
    }

    expect(testGame).toThrow(Error);
    expect(testGame).toThrow('Game: Game name must be a single word no spaces only a-z, 0-9');
  })

  test('Add game: Duplicate game name', () => {
    const gameName = "TestGame";
    const testPlayerName = "TestPlayer";
    gameController.addNewGame(gameName, testPlayerName);

    expect(gameController.getActiveGames()).toEqual(1);

    const addDuplicate = () => {
      return gameController.addNewGame(gameName, testPlayerName + 1);
    }

    expect(addDuplicate).toThrow(Error);
    expect(addDuplicate).toThrow('Game: Game name must be unique');
  })
});

describe('Test joining game by UUID', () => {
  let gameController;
  let identifier;

  beforeEach(() => {
    gameController = new GameController();
    const game = gameController.addNewGame(undefined, "TestPlayer");
    identifier = game.gameID;
  })

  test('Join game: empty arguments', () => {
    const joinEmpty = () => {
      return gameController.joinGame();
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow("Supplied game id is not an active game");
  })

  test('Join game: invalid id', () => {
    const joinEmpty = () => {
      return gameController.joinGame(1, undefined);
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow("Supplied game id is not an active game");
  })

  test('Join game: invalid player name no name', () => {
    const joinEmpty = () => {
      return gameController.joinGame(identifier, "");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: invalid player name invalid symbols', () => {
    const joinEmpty = () => {
      return gameController.joinGame(identifier, "#name");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: Valid join but same name', () => {
    const joinEmpty = () => {
      return gameController.joinGame(identifier, "TestPlayer");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Game: Player name already exists in this game');
  })

  test('Join game: Valid join', () => {
    const joinState = gameController.joinGame(identifier, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");
  })

  test('Join game: Dubble join', () => {
    const joinState = gameController.joinGame(identifier, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");

    const dubbleJoin = () => {
      return gameController.joinGame(identifier, "TestPlayer2");
    }

    expect(dubbleJoin).toThrow(Error);
    expect(dubbleJoin).toThrow("Supplied game is full");
  })

  test('Join game: diffrent uuid', () => {
    const withNewUUID = () => {
      return gameController.joinGame(uuid(), "TestPlayer2");
    }

    expect(withNewUUID).toThrow(Error);
    expect(withNewUUID).toThrow('Supplied game id is not an active game');
  })
});

describe('Test joining active game with alias', () => {
  let gameController;
  const gameAlias = "TestGame";

  beforeEach(() => {
    gameController = new GameController();
    gameController.addNewGame(gameAlias, "TestPlayer");
  })

  test('Join game: invalid id', () => {
    const joinEmpty = () => {
      return gameController.joinGame(1, undefined);
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow("Supplied game id is not an active game");
  })

  test('Join game: invalid player name no name', () => {
    const joinEmpty = () => {
      return gameController.joinGame(gameAlias, "");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: invalid player name invalid symbols', () => {
    const joinEmpty = () => {
      return gameController.joinGame(gameAlias, "#name");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Player: Empty/Invalid username, no spaces and only letters and numbers');
  })

  test('Join game: Valid join but same name', () => {
    const joinEmpty = () => {
      return gameController.joinGame(gameAlias, "TestPlayer");
    };

    expect(joinEmpty).toThrow(Error);
    expect(joinEmpty).toThrow('Game: Player name already exists in this game');
  })

  test('Join game: Valid join', () => {
    const joinState = gameController.joinGame(gameAlias, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");
  })

  test('Join game: Dubble join', () => {
    const joinState = gameController.joinGame(gameAlias, "TestPlayer1");

    expect(joinState.joined).toBeTruthy();
    expect(joinState.player).toEqual("TestPlayer1");

    const dubbleJoin = () => {
      return gameController.joinGame(gameAlias, "TestPlayer2");
    }

    expect(dubbleJoin).toThrow(Error);
    expect(dubbleJoin).toThrow("Supplied game is full");
  })
});

describe('Test get game call', () => {
  let gameController;
  const gameAlias = "TestGame";

  let gameID;

  beforeEach(() => {
    gameController = new GameController();
    const game = gameController.addNewGame(gameAlias, "TestPlayer");
    gameID = game.gameID;
  })

  test('Get game no parameters', () => {
    const badCall = () => {
      return gameController.getGame();
    }

    expect(badCall).toThrow(Error);
    expect(badCall).toThrow("GameController: no game with such identifier is active");
  })

  test('Get game by uuid', () => {
    const game = gameController.getGame(gameID);

    expect(validate(game.gameID)).toBeTruthy();
    expect(game.gameID).toEqual(gameID);
  });

  test('Get game by alias', () => {
    const game = gameController.getGame(gameAlias);

    expect(validate(game.gameID)).toBeTruthy();
    expect(game.gameName).toEqual(gameAlias);
  });

  test("Get game by different uuid", () => {
    const withNewUUID = () => {
      return gameController.getGame(uuid());
    }

    expect(withNewUUID).toThrow(Error);
    expect(withNewUUID).toThrow("GameController: no game with such identifier is active");
  })
});

describe('Test player moves before 2nd player joins', () => {
  let gameController;
  const gameAlias = "TestGame";

  let gameID;

  beforeEach(() => {
    gameController = new GameController();
    const game = gameController.addNewGame(gameAlias, "TestPlayer");
    gameID = game.gameID;
  })

  test('Play move without any parameters', () => {
    let playEmpty = () => {
      return gameController.playMove();
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: no game with such identifier is active");
  })

  test('Play move missing player and move', () => {
    let playEmpty = () => {
      return gameController.playMove(gameID);
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: Game is waiting for another player");
  })

  test('Play move missing move', () => {
    let playEmpty = () => {
      return gameController.playMove(gameID, "TestPlayer");
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: Game is waiting for another player");
  })

  test('Play valid move', () => {
    let playEmpty = () => {
      return gameController.playMove(gameID, "TestPlayer", "rock");
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: Game is waiting for another player");
  })

})

describe('Test player moves with active game', () => {
  let gameController;
  const gameAlias = "TestGame";

  let gameID;

  beforeEach(() => {
    gameController = new GameController();
    const game = gameController.addNewGame(gameAlias, "TestPlayer");
    gameID = game.gameID;


    gameController.joinGame(gameID, "TestPlayer2");
  })

  test('Play move without any parameters', () => {
    let playEmpty = () => {
      return gameController.playMove();
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: no game with such identifier is active");
  })

  test('Play move missing player and move', () => {
    let playEmpty = () => {
      return gameController.playMove(gameID);
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("GameController: Player undefined does not exist");
  })

  test('Play move missing move', () => {
    let playEmpty = () => {
      return gameController.playMove(gameID, "TestPlayer");
    }

    expect(playEmpty).toThrow(Error);
    expect(playEmpty).toThrow("Player: Bad move, use only a single word and no spaces");
  })

  test('Play valid move: rock', () => {
    const moveState = gameController.playMove(gameID, "TestPlayer", "rock");

    expect(moveState).toBeTruthy();
  })

  test('Play valid move: scissors', () => {
    const moveState = gameController.playMove(gameID, "TestPlayer", "scissors");

    expect(moveState).toBeTruthy();
  })

  test('Play valid move: paper', () => {
    const moveState = gameController.playMove(gameID, "TestPlayer", "paper");

    expect(moveState).toBeTruthy();
  })

  test('Play invalid move: lizard', () => {

    const invalidMove = () => {
      return gameController.playMove(gameID, "TestPlayer", "lizard");
    }

    expect(invalidMove).toThrow(Error);
    expect(invalidMove).toThrow("Unrecognized move: lizard");

  })
});
