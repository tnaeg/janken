import request from 'supertest';
import { app } from '../app/Server.js';

const requestWithSuperTest = request(app);

describe("Test the root path", () => {
  test("It should response the get method", async ()=> {
    const res = await requestWithSuperTest.get('/');
    expect(res.status).toEqual(200);
  });
});

let obj = {
  "username": "Tester1",
  "gamename": "TestGame",
};
describe("Test game", () => {
  test("It should fail", done => {
    request(app)
      .post("/api/games")
      .send({username: "Tester1", gamename: "TestGame"})
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });
});
