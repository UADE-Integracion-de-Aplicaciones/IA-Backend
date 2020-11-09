const request = require("supertest");
const { syncDb } = require("../../src/sequelize/models");
const { crearData } = require("../fixtures");
const app = require("../../src/app");

beforeAll(async () => {
  await syncDb(true);
  //await crearData();
});

describe("POST /transacciones/depositar", () => {
  it("debería crear el deposito sin problemas", () => {
    const cbu = "123";
    const dni = "123";
    const cantidad = 1200;
    return request(app)
      .post("/transacciones/depositar")
      .send({ cbu, dni, cantidad })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        //console.log(response);
      });
  });
});
