//API base URL: https://share-a-meal-2022.herokuapp.com/

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const router = require("./src/routes/user-routes");
const res = require("express/lib/response");
app.use(bodyParser.json());
app.use(router);

app.all("*", (req, res) => {
  const method = req.method;
  console.log(`Called ${method} method`);
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    result: "End point not found",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
