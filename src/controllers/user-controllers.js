const req = require("express/lib/request");
const dbconnection = require("../../database/dbconnection");
// TODO: Start using this to validate input
//TODO: add all inputs
const assert = require("assert");

let database = [];
let id = 0;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;

    let { emailAdress, firstName, lastName, street, city, password } = user;
    try {
      assert(typeof emailAdress === "string", "Email must be a string");
      assert(typeof firstName === "string", "firstName must be a string");
      assert(typeof lastName === "string", "lastName must be a string");
      assert(typeof street === "string", "street must be a string");
      assert(typeof city === "string", "city must be a string");
      assert(password.length > 0, "password may not be empty");
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };
      console.log(error);
      res.status(400).json({
        status: 400,
        message: error.toString(),
      });
      next(error);
    }
  },

  validateEmailCreateUser: (req, res, next) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const user = req.body;

      connection.query(
        `SELECT emailAdress FROM USER WHERE emailAdress = ${user.emailAdress}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          try {
            assert(
              results.length < 1,
              "There's already a user registered with this email address"
            );
          } catch (err) {
            const error = {
              status: 409,
              message: err.message,
            };
            console.log(error);
            res.status(409).json({
              status: 409,
              message: error.toString(),
            });
            next(error);
          }
        }
      );
    });
  },

  addUser: (req, res) => {
    // const user = req.body;

    // let error = verifyInput(user);
    // const userExists = database.filter(
    //   (item) => item.emailAddress == user.emailAddress
    // );

    // if (error.error || userExists.length > 0) {
    //   let errorMessage = error.errorMessage;
    //   if (userExists.length > 0) {
    //     errorMessage.push("A user with that email address already exists");
    //   }
    //   res.status(409).json({
    //     status: 409,
    //     message: error.errorMessage,
    //     error: "Bad Request",
    //   });
    // } else {
    //   id++;
    //   let userToAdd = {
    //     id,
    //     ...user,
    //   };
    //   database.push(userToAdd);
    //   res.status(200).json({
    //     status: 200,
    //     result: userToAdd,
    //   });
    // }

    //TODO: error handling and input validation
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const user = req.body;

      connection.query(
        `INSERT INTO user (firstName, lastName, street, city, password, emailAdress) VALUES ('${user.firstName}', '${user.lastName}', '${user.street}', '${user.city}', '${user.password}', '${user.emailAdress}')`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          console.log("#results = ", results.length);
          console.log(results);
          res.status(200).json({
            status: 200,
            result: results,
          });

          // pool.end((err) => {
          //   console.log("pool was closed");
          // });
        }
      );
    });
  },

  getAllUsers: (req, res) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        // Handle error after the release.
        if (error) throw error;

        console.log("#results = ", results.length);
        console.log(results);
        res.status(200).json({
          status: 200,
          result: results,
        });

        // pool.end((err) => {
        //   console.log("pool was closed");
        // });
      });
    });
  },

  getUserProfile: (req, res) => {
    res.status(501).json({
      status: 501,
      message: "not yet implemented",
    });
  },

  getUserById: (req, res) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const id = req.params.userID;
      connection.query(
        `SELECT * FROM user WHERE id = ${id}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          console.log("#results = ", results.length);
          console.log(results);
          res.status(200).json({
            status: 200,
            result: results,
          });

          // pool.end((err) => {
          //   console.log("pool was closed");
          // });
        }
      );
    });
  },

  updateUser: (req, res) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const user = req.body;
      //`INSERT INTO user (firstName, lastName, street, city, password, emailAdress)
      id = req.params.userID;
      connection.query(
        `UPDATE user SET firstName = '${user.firstName}', lastName = '${user.lastName}', street = '${user.street}', city = '${user.city}', password = '${user.password}', emailAdress = '${user.emailAdress}' WHERE id = ${id}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          console.log("#results = ", results.length);
          console.log(results);
          res.status(200).json({
            status: 200,
            result: results,
          });

          // pool.end((err) => {
          //   console.log("pool was closed");
          // });
        }
      );
    });
  },

  deleteUserById: (req, res) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const id = req.params.userID;
      connection.query(
        `DELETE FROM user WHERE id = ${id}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          console.log("#results = ", results.length);
          console.log(results);
          res.status(200).json({
            status: 200,
            result: results,
          });

          // pool.end((err) => {
          //   console.log("pool was closed");
          // });
        }
      );
    });
  },
};

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

module.exports = controller;
