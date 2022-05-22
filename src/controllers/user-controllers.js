const req = require("express/lib/request");
const dbconnection = require("../../database/dbconnection");
//TODO: add all inputs
const assert = require("assert");
const { type } = require("express/lib/response");
const { doesNotMatch } = require("assert");

let controller = {
    validateUser: (req, res, next) => {
        let user = req.body;

        let { emailAdress, firstName, lastName, street, city, password } = user;
        try {
            assert(typeof emailAdress === "string", "Email must be a string");
            assert(
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    emailAdress
                ),
                "please enter a valid emailAdress"
            );
            assert(typeof firstName === "string", "firstName must be a string");
            assert(typeof lastName === "string", "lastName must be a string");
            assert(typeof street === "string", "street must be a string");
            assert(typeof city === "string", "city must be a string");
            assert(typeof password === "string", "password must be a string");
            assert(
                password.length > 5,
                "password must be at least 6 characters long"
            );
            next();
        } catch (err) {
            res.status(400).json({
                statusCode: 400,
                message: err.message,
            });
        }
    },

    addUser: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    statusCode: 500,
                    message: "Connection to server failed",
                });
            }

            const user = req.body;
            // validateUser(user);
            const firstName = user.firstName;
            const lastName = user.lastName;
            const street = user.street;
            const city = user.city;
            const password = user.password;
            const emailAdress = user.emailAdress;

            console.log(firstName);

            connection.query(
                "INSERT INTO user (firstName, lastName, street, city, password, emailAdress) VALUES (?, ?, ?, ?, ?, ?); SELECT * FROM user WHERE emailAdress = ?",
                [
                    firstName,
                    lastName,
                    street,
                    city,
                    password,
                    emailAdress,
                    emailAdress,
                ],
                function (error, results, fields) {
                    if (error) {
                        res.status(409).json({
                            statusCode: 409,
                            message: `A user with emailAdres ${emailAdress} already exists`,
                        });
                    } else {
                        res.status(201).json({
                            statusCode: 201,
                            result: results[1],
                        });
                    }
                }
            );
        });
    },

    getAllUsers: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            const queryParams = req.query;
            const { firstName, isActive } = queryParams;
            let queryString = "SELECT * FROM user";

            if (firstName || isActive) {
                queryString += " WHERE ";

                if (firstName) {
                    queryString += `firstName = '${firstName}' `;
                }
                if (firstName && isActive) {
                    queryString += " AND ";
                }

                if (isActive) {
                    queryString += `isActive = '${isActive}'`;
                }
            }

            if (err) throw err; // not connected!

            // Use the connection
            connection.query(queryString, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) {
                    console.log(error);
                }

                res.status(200).json({
                    status: 200,
                    result: results,
                });
            });
        });
    },

    getUserProfile: (req, res) => {
        const id = req.userID;
        dbconnection.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "Unable to connect to server",
                });
            }

            connection.query(
                "SELECT * FROM user WHERE id = ?",
                [id],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }

                    if (results.length < 1) {
                        res.status(404).json({
                            statusCode: 404,
                            message: `User with ID ${id} was not found`,
                        });
                    } else {
                        res.status(200).json({
                            statusCode: 200,
                            result: results[0],
                        });
                    }
                }
            );
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
                    if (error) {
                        console.log(error);
                    }

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

            //checks if the ID from the token matches the given ID
            if (req.userID == id) {
                const firstName = user.firstName;
                const lastName = user.lastName;
                const street = user.street;
                const city = user.city;
                const password = user.password;
                const emailAdress = user.emailAdress;

                connection.query(
                    `UPDATE user SET firstName = ?, lastName = ?, street = ?, city = ?, password = ?, emailAdress = ? WHERE id = ?`,
                    [
                        firstName,
                        lastName,
                        street,
                        city,
                        password,
                        emailAdress,
                        id,
                    ],
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
            } else {
                res.status(403).json({
                    statusCode: 403,
                    message: "You may only edit your own account info",
                });
            }
        });
    },

    deleteUserById: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            if (err) throw err; // not connected!

            const id = req.params.userID;
            //check if param ID matches token ID
            if (id == req.userID) {
                // Use the connection
                connection.query(
                    `DELETE FROM user WHERE id = ?`,
                    [id],
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) console.log(error);

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
            } else {
                res.status(403).json({
                    statusCode: 403,
                    message: "You may only delete your own account",
                });
            }
        });
    },
};

module.exports = controller;
