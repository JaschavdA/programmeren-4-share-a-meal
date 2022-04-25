const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let id = 0;

app.post("/api/user", (req, res) => {
  const user = req.body;

  let error = verifyInput(user);
  const userExists = database.filter(
    (item) => item.emailAddress == user.emailAddress
  );

  if (error.error || userExists.length > 0) {
    let errorMessage = error.errorMessage;
    if (userExists.length > 0) {
      errorMessage.push("A user with that email address already exists");
    }
    res.status(409).json({
      status: 409,
      message: error.errorMessage,
      error: "Bad Request",
    });
  } else {
    id++;
    let userToAdd = {
      id,
      ...user,
    };
    database.push(userToAdd);
    res.status(200).json({
      status: 200,
      result: userToAdd,
    });
  }
});

app.get("/api/user", (req, res) => {
  res.status(200).json({
    status: 200,
    result: database,
    extra_info: "authorization not yet implemented",
  });
});

app.get("/api/user/profile", (req, res) => {
  res.status(501).json({
    status: 501,
    message: "not yet implemented",
  });
});

app.get("/api/user/:userID", (req, res) => {
  const userID = req.params.userID;
  const user = database.filter((item) => item.id == userID);
  if (user.length > 0) {
    res.status(200).json({
      status: 200,
      result: user,
      extra_info: "authorization has not yet been implemented",
    });
  } else
    res.status(404).json({
      status: 404,
      message: `User with id: ${userID} was not found`,
    });
});

app.put("/api/user/:userID", (req, res) => {
  const userID = req.params.userID;
  const updatedUser = req.body;
  const index = database.findIndex((item) => item.id == userID);
  if (index < 0) {
    res.status(404).json({
      status: 404,
      message: `User with id: ${userID} was not found`,
    });
  }
  const inputError = verifyInput(updatedUser);
  if (inputError.error) {
    res.status(400).json({
      statusbar: 400,
      message: inputError.errorMessage,
      test: updatedUser,
    });
  } else {
    database[index] = { id, ...updatedUser };
    res.status(200).json({
      status: 200,
      result: database[index],
      extra_info: "Authorization is not implemented yet",
    });
  }
});

app.delete("/api/user/:userID", (req, res) => {
  const userID = req.params.userID;
  const index = database.findIndex((item) => item.id == userID);
  if (index >= 0) {
    database.splice(index, 1);
    res.status(200).json({
      status: 200,
      message: `User with id: ${userID} was deleted`,
      extra_info: "Authorization is not yet implemented.",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `User with id: ${userID} was not found`,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//returns true if there is an error, does not check if user email already exists.
function verifyInput(user) {
  let error = false;
  let errorMessage = [];

  if (
    typeof user.firstName === "undefined" ||
    user.firstName.length < 1 ||
    typeof user.firstName != "string"
  ) {
    error = true;
    errorMessage.push(
      "user must have a value firstName which is must be a non empty String"
    );
  }
  if (
    typeof user.lastName === "undefined" ||
    user.lastName.length < 1 ||
    typeof user.lastName != "string"
  ) {
    error = true;
    errorMessage.push(
      "A user must have a lastName variable which must be a non empty String"
    );
  }
  if (typeof user.street === "undefined" || user.street.length < 1) {
    error = true;
    errorMessage.push(
      "A user must have a street variable which may not be empty"
    );
  }

  if (
    typeof user.city === "undefined" ||
    user.city.length < 1 ||
    typeof user.city != "string"
  ) {
    error = true;
    errorMessage.push(
      "A user must have a city variable which must be a non empty string"
    );
  }
  if (typeof user.password === "undefined" || user.password.length < 1) {
    error = true;
    errorMessage.push(
      "A user must have a password variable which may not be empty"
    );
  }
  if (
    typeof user.emailAddress === "undefined" ||
    user.emailAddress.length < 1 ||
    String(user.emailAddress).match(
      "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/"
    ) == false
  ) {
    error = true;
    errorMessage.push(
      "A user must have an emailAddress variable which must be a valid emailAddress"
    );
  }

  return { error, errorMessage };
}
