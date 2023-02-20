import GameServer from "../game/GameServer.js";

const contentType = 'Content-Type';
const data = 'application/json';

function validateRequest(request, maxLength, validKeys) {

  const bodyLength = Object.keys(request.body).length;

  if (bodyLength > maxLength)
    return false;

  let validatedKeys = 0;
  validKeys.forEach(key => {
    if (key.startsWith('#')) //Optional key
    {
      if (request.body[key.substring(1)])
        validatedKeys++;
    }
    else if (request.body[key])
      validatedKeys++;
  });

  return validatedKeys == bodyLength;
}

function validateParameters(request, key) {
  return request.params[key];
}

function responseSuccess(message, response, statusCode) {
  response.setHeader(contentType, data);
  response.statusCode = statusCode;
  if (message)
    response.end(JSON.stringify(message));
}

function responseRequestFailed(error, response, statusCode) {
  response.setHeader(contentType, data);
  response.statusCode = statusCode;
  response.end(JSON.stringify(error.message));
}

function createGame(req, res, gameServer) {
  if (validateRequest(req, 2, ["#gamename", "username"])) {
    try {
      if (gameServer instanceof GameServer) {
        let newGame = gameServer.addGame(req.body.gamename, req.body.username);
        responseSuccess(newGame, res, 201);
      }
    } catch (error) {
      responseRequestFailed(error, res, 404);
    }
  }
  else {
    responseRequestFailed(Error("Invalid username or gamename"), res, 404);
  }
};

function joinGame(req, res, gameServer) {
  if (validateParameters(req, "id") &&
    validateRequest(req, 1, ["name"])) {
    try {
      const gameStatus = gameServer.joinGame(req.params.id, req.body.name);
      responseSuccess(gameStatus, res, 200);
    } catch (error) {
      responseRequestFailed(error, res, 406);
    }
  }
  else
    responseRequestFailed(Error("Invalid game id or username"), res, 404);
}

function getGame(req, res, gameServer) {
  if (validateParameters(req, "id")) {
    try {
      const game = gameServer.getGame(req.params.id);
      responseSuccess(game.getGameState(), res, 200);
    }
    catch (error) {
      responseRequestFailed(error, res, 404);
    }
  }
  else
    responseRequestFailed(Error("Missing ID or misspelled"), 406);
}

function playMove(req, res, gameServer) {
  if (validateParameters(req, "id") &&
    validateRequest(req, 2, ["name", "move"])) {
    try {
      gameServer.playMove(req.params.id, req.body.name, req.body.move);
      res.sendStatus(204);
    } catch (error) {
      responseRequestFailed(error, res, 400)
    }
  }
  else
    responseRequestFailed(Error("Invalid id/name/move"), 406);

}

const _playMove = playMove;
const _getGame = getGame;
const _joinGame = joinGame;
const _createGame = createGame;

export {
  _playMove as playMove,
  _getGame as getGame,
  _createGame as createGame,
  _joinGame as joinGame
};
