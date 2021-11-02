require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});
app.use("/public", express.static("uploads"));

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
