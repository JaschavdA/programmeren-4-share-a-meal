const req = require("express/lib/request");
const jwtSecretKey = process.env.JWT_Key;
const jwt = require("jsonwebtoken");
const dbconnection = require("../../database/dbconnection");
//TODO: add all inputs
const assert = require("assert");

let authController = {
    login: (req, res) => {
        const loginInfo = req.body;
        const emailAdress = loginInfo.emailAdress;
        const password = loginInfo.password;

        dbconnection.getConnection(function (err, connection) {
            if (err) {
                res.status(500).json({
                    statusCode: 500,
                    message: "Connection with server failed",
                });
            }

            connection.query(
                "SELECT id, emailAdress, password, firstName, lastName FROM user WHERE emailAdress = ?",
                [emailAdress],
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }
                    connection.release;
                    const returnedEmail = results[0].emailAdress;
                    const returnedPassword = results[0].password;
                    const userID = results[0].id;
                    console.log(returnedEmail);
                    console.log(returnedPassword);
                    console.log(userID);
                    //Since we search for the user by their email it is not needed to test if the email is the same during the password validation
                    if (!returnedEmail) {
                        res.status(404).json({
                            statusCode: 404,
                            message: `User with emailAdres ${emailAdress} has not been found`,
                        });
                    }
                    //Since we search for the user by their email it is not needed to test if the email is the same during the password validation because it will always be the same
                    if (password === returnedPassword) {
                        const payload = { id: userID };
                        const userinfo = results[0];
                        jwt.sign(
                            payload,
                            jwtSecretKey,
                            { expiresIn: "12d" },
                            function (err, token) {
                                if (err) {
                                    console.log(error);
                                }
                                console.log(jwtSecretKey);
                                res.status(200).json({
                                    statusCode: 200,
                                    results: { ...userinfo, token },
                                });
                            }
                        );
                    } else {
                        res.status(400).json({
                            statusCode: 400,
                            message: "email or password is not correct",
                        });
                    }
                }
            );
        });
    },

    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                statusCode: 401,
                message: "Authorization header missing!",
            });
        } else {
            const token = authHeader.substring(7, authHeader.length);
            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        statusCode: 401,
                        message: "Invalid token",
                        datetime: new Date().toISOString(),
                    });
                }
                if (payload) {
                    req.userID = payload.id;
                    next();
                }
            });
        }
    },

    validateLoginInfo: (req, res, next) => {
        user = req.body;
        console.log(user);
        console.log(typeof user.emailAdress);
        console.log(typeof user.password);
        try {
            assert(
                typeof user.emailAdress === "string",
                "Email must be a string"
            );
            assert(
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    user.emailAdress
                ),
                "please enter a valid emailAdress"
            );
            assert(user.password.length > 0, "password may not be empty");
            next();
        } catch (err) {
            res.status(400).json({
                status: 400,
                message: err.message,
            });
        }
    },
};

module.exports = authController;
