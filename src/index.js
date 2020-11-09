const app = require("./app");

const port = parseInt(process.env.PORT, 10) || 8080;
app.set("port", port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
