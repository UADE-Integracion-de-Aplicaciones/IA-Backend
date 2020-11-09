const { syncDb } = require("../src/sequelize/models");

beforeAll(() => {
  //return syncDb(true);
});

it("Testing to see if Jest works", () => {
  expect(1).toBe(1);
});
