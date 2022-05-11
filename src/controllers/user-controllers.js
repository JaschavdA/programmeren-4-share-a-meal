const req = require("express/lib/request");
const dbconnection = require("../../database/dbconnection");
//TODO: add all inputs
const assert = require("assert");

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
      res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
  },

  addUser: (req, res) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      const user = req.body;

      connection.query(
        `INSERT INTO user (firstName, lastName, street, city, password, emailAdress) VALUES ('${user.firstName}', '${user.lastName}', '${user.street}', '${user.city}', '${user.password}', '${user.emailAdress}')`,
        function (error, results, fields) {
          // When done with the connection, release it.

          // Handle error after the release.
          if (error) {
            res.status(409).json({
              status: 409,
              message:
                "There's already a user registered with this email address",
            });
            //if there is no error, give response showing success
          } else {
            connection.query(
              `SELECT id FROM user WHERE emailAdress = '${user.emailAdress}'`,
              function (error, results, fields) {
                connection.release();

                console.log(results[0].id);

                id = results[0].id;
                const returnValue = { id, ...user };
                res.status(201).json({
                  status: 201,
                  result: returnValue,
                });
              }
            );
          }
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

        res.status(200).json({
          status: 200,
          result: results,
        });
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
    const id = req.params.userID;
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection

      connection.query(
        `SELECT * FROM user WHERE id = ${id}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          if (results.length > 0) {
            res.status(200).json({
              status: 200,
              result: results,
            });
          } else {
            res.status(404).json({
              status: 404,
              message: `User with id: ${id} was not found`,
            });
          }
        }
      );
    });
  },

  updateUser: (req, res) => {
    const id = req.params.userID;

    const user = req.body;
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      // Use the connection

      connection.query(
        `UPDATE user SET firstName = '${user.firstName}', lastName = '${user.lastName}', street = '${user.street}', city = '${user.city}', password = '${user.password}', emailAdress = '${user.emailAdress}' WHERE id = ${id}`,
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) {
            res.status(409).json({
              status: 409,
              message:
                "There's already a user registered with this email address",
            });
          } else if (results.affectedRows > 0) {
            res.status(200).json({
              status: 200,
              result: "User Successfully updated",
            });
          } else {
            res.status(400).json({
              status: 400,
              message: `user with id: ${id} could not be found`,
            });
          }
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
          // if (error) console.log(error);

          if (results.affectedRows > 0) {
            res.status(200).json({
              status: 200,
              message: `user with id: ${id} has been deleted`,
            });
          } else {
            res.status(400).json({
              status: 400,
              message: `user with id: ${id} could not be found`,
            });
          }
        }
      );
    });
  },
};

module.exports = controller;
