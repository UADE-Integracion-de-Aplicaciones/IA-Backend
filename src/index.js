const app = require("./app");

const port = parseInt(process.env.PORT, 10) || 8080;
app.set("port", port);

const GENERATE_SAMPLE_DATA = true;
if (process.env.NODE_ENV === "development") {
  require("../../../tests/fixtures/index").crearData();
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
