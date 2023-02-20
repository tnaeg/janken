import request from 'supertest';
import { app } from '../app/Server.js';
import { validate } from 'uuid';

const superServer = request(app);

describe("Test the root path", () => {
  test("It should response the get method", async () => {
    const res = await superServer.get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual("Welcome to the rock-paper-scissors server");
  });
});

const goodGame = {
  username: "TestPlayer1",
  gamename: "TestGame"
};

const baseGame = {
  username: "TestPlayer1"
};

const badNoPlayer = {
  gamename: ""
};

const badPlayerNameSpace = {
  username: "Donald Duck"
};

const badPlayerNameBadSymbol = {
  username: "Donald#Duck!"
};

const badGameToLarge = {
  username: "TestPlayer1",
  gameName: "TestGame",
  move: "rock"
};

const badGameAliasSpaces = {
  gamename: "T e s t g a m e",
  username: "TestPlayer1"
};

const badGameAliasSymbols = {
  gamename: "T3$t~g4m!",
  username: "TestPlayer1"
};

const playerBase = {
  name: "TestPlayer0"
};

const badJoinNoPlayer = {
};

const badJoinPlayerNameSpace = {
  name: "Donald Duck"
};

const badJoinPlayerNameBadSymbol = {
  name: "Donald#Duck!"
};

describe("Crate a game", () => {
  const apiRoute = '/api/games';

  test('Empty game call', done => {
    superServer
      .post(apiRoute)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Player: Invalid call without name object');
        done();
      });
  });

  test('Create a game without player', done => {
    superServer
      .post(apiRoute)
      .send(badNoPlayer)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Invalid username or gamename');
        done();
      });
  });

  test('Create a game with bad player name with space', done => {
    superServer
      .post(apiRoute)
      .send(badPlayerNameSpace)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Player: Empty/Invalid username, no spaces and only letters and numbers');
        done();
      });
  });

  test('Create a game with a bad player name with bad symbols', done => {
    superServer
      .post(apiRoute)
      .send(badPlayerNameBadSymbol)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Player: Empty/Invalid username, no spaces and only letters and numbers');
        done();
      });
  })

  test('Create a game with to many key calls', done => {
    superServer
      .post(apiRoute)
      .send(badGameToLarge)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Invalid username or gamename');
        done();
      });
  })

  test('Create a game with game alias with space', done => {
    superServer
      .post(apiRoute)
      .send(badGameAliasSpaces)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Game: Game name must be a single word no spaces only a-z, 0-9');
        done();
      });
  });

  test('Create a game with a bad player name with bad symbols', done => {
    superServer
      .post(apiRoute)
      .send(badGameAliasSymbols)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual('Game: Game name must be a single word no spaces only a-z, 0-9');
        done();
      });
  })

  test("Create a game was successfull", done => {
    superServer
      .post("/api/games")
      .send(goodGame)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(validate(response.body.gameID)).toBe(true);
        expect(response.statusCode).toBe(201);
        done();
      });
  });
});


describe('Test joining a game', () => {
  let id;
  const apiRoute = '/api/games';

  beforeEach(async () => {
    const response = await superServer
      .post(apiRoute)
      .send(baseGame);
    id = response.body.gameID;
  });

  test('Join a game: bad id', done => {
    let nodef;
    superServer
      .post(`${apiRoute}/${nodef}/join`)
      .send(playerBase)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(406);
        expect(response.body).toEqual('Supplied game id is not an active game');
        done();
      });
  });

  test('Join a game: no data', done => {
    superServer
      .post(`${apiRoute}/${id}/join`)
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(406);
        expect(response.body).toEqual('Player: Invalid call without name object');
        done();
      });
  });


  test('Join a game: no name', done => {
    superServer
      .post(`${apiRoute}/${id}/join`)
      .send(badGameToLarge)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(404);
        expect(response.body).toEqual('Invalid game id or username');
        done();
      });
  });

  test('Join a game', done => {
    superServer
      .post(`${apiRoute}/${id}/join`)
      .send(playerBase)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(200);
        expect(response.body.joined).toBeTruthy();
        done();
      });
  });

  test('Dubble join a game', async () => {
    await superServer
      .post(`${apiRoute}/${id}/join`)
      .send(playerBase);

    superServer
      .post(`${apiRoute}/${id}/join`)
      .send(playerBase)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(406);
        expect(response.body).toEqual("Supplied game is full");
      });
  });
});


const rockMove = {
  name: "TestPlayer1",
  move: "rock"
};

const scissorsMove = {
  name: "TestPlayer1",
  move: "scissors"
};

const paperMove = {
  name: "TestPlayer1",
  move: "paper"
};

const lizardMove = {
  name: "TestPlayer1",
  move: "lizard"
};

const noMove = {
  name: "TestPlayer1",
  move: ""
};

const badMoveNoPlayer = {
  move: "rock"
}

describe('Test play moves: ', () => {
  let id;
  const apiRoute = '/api/games';

  beforeEach(async () => {
    const responseCreate = await superServer
      .post(apiRoute)
      .send(baseGame);
    id = responseCreate.body.gameID;

    await superServer
      .post(`${apiRoute}/${id}/join`)
      .send(playerBase);

  });

  test('Play rock', done => {
    superServer
      .post(`${apiRoute}/${id}/move`)
      .send(rockMove)
      .then(response => {
        expect(response.statusCode).toEqual(204);
        done();
      });
  });

  test('Play scissors', done => {
    superServer
      .post(`${apiRoute}/${id}/move`)
      .send(scissorsMove)
      .then(response => {
        expect(response.statusCode).toEqual(204);
        done();
      });
  });

  test('Play paper', done => {
    superServer
      .post(`${apiRoute}/${id}/move`)
      .send(paperMove)
      .then(response => {
        expect(response.statusCode).toEqual(204);
        done();
      });
  });
})



