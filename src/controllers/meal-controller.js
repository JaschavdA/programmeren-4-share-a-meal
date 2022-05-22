const req = require("express/lib/request");
const dbconnection = require("../../database/dbconnection");
const assert = require("assert");
const { builtinModules } = require("module");
const { all } = require("../routes/auth-routes");
const { type } = require("express/lib/response");
const { fail } = require("assert");
const { end } = require("../../database/dbconnection");
const { workerData } = require("worker_threads");

let mealController = {
    validateMeal: (req, res, next) => {
        const meal = req.body;

        const name = meal.name;
        const description = meal.description;
        const isActive = meal.isActive;
        const isVega = meal.isVega;
        const isVegan = meal.isVegan;
        const isToTakeHome = meal.isToTakeHome;
        const imageUrl = meal.imageUrl;
        const dateTime = new Date(meal.dateTime);
        const allergenes = meal.allergenes;
        const maxAmountOfParticipants = meal.maxAmountOfParticipants;
        const price = meal.price;

        try {
            assert(typeof name === "string", "meal must be a string");
            assert(
                typeof description === "string",
                "description must be a string"
            );
            assert(typeof isActive === "number", "isActive must be a number");
            assert(
                isActive === 0 || isActive === 1,
                "isActive must be either 1 (true) or 0 (false)"
            );
            assert(typeof isVega === "number", "isVega must be a number");
            assert(
                isVega === 0 || isVega === 1,
                "isVega must be either 1 (true) or 0 (false)"
            );
            assert(typeof isVegan === "number", "isVegan must be a number");
            assert(
                isVegan === 0 || isVegan === 1,
                "isVegan must be either 1 (true) or 0 (false)"
            );
            assert(
                typeof isToTakeHome === "number",
                "isToTakeHome must be a number"
            );
            assert(
                isToTakeHome === 0 || isToTakeHome === 1,
                "isVega must be either 1 (true) or 0 (false)"
            );
            assert(typeof imageUrl === "string", "imageUrl must be a string");
            assert(
                typeof maxAmountOfParticipants === "number",
                "maxAmountOfParticipants must be a number"
            );

            assert(typeof price === "number", "price must be a number");
            assert(!isNaN(dateTime.getTime()), "dateTime must be a valid date");

            let validAllergenes = true;
            if (allergenes) {
                for (let index = 0; index < allergenes.length; index++) {
                    if (
                        allergenes[index] != "gluten" &&
                        allergenes[index] != "noten" &&
                        allergenes[index] != "lactose"
                    ) {
                        validAllergenes = false;
                    }
                }
            } else {
                validAllergenes = false;
            }
            assert(
                validAllergenes,
                "allergenes may only be gluten, noten, and lactose"
            );

            next();
        } catch (error) {
            console.log(error);
            res.status(400).json({
                statusCode: 400,
                message: error.message,
            });
        }
    },

    //Add validateAllergenes in meal-routes
    createMeal: (req, res) => {
        const meal = req.body;
        const cookID = req.userID;

        const name = meal.name;
        const description = meal.description;
        const isActive = meal.isActive;
        const isVega = meal.isVega;
        const isVegan = meal.isVegan;
        const isToTakeHome = meal.isToTakeHome;
        const dateTime = new Date(meal.dateTime);
        const imageUrl = meal.imageUrl;
        const allergenes = req.body.allergenes.join(",");

        const maxAmountOfParticipants = meal.maxAmountOfParticipants;
        const price = meal.price;
        const creationDate = new Date();
        const updateDate = new Date();

        dbconnection.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "failed to connect to server",
                });
            }

            connection.query(
                "INSERT INTO meal (isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); SELECT * FROM meal WHERE cookId = ? ORDER BY createDate DESC LIMIT 1",

                [
                    isActive,
                    isVega,
                    isVegan,
                    isToTakeHome,
                    dateTime,
                    maxAmountOfParticipants,
                    price,
                    imageUrl,
                    cookID,
                    creationDate,
                    updateDate,
                    name,
                    description,
                    allergenes,
                    cookID,
                ],
                function (error, results, fields) {
                    const mealID = results[1][0].id;

                    connection.query(
                        "INSERT INTO meal_participants_user VALUES (?, ?)",
                        [mealID, cookID],
                        function (error, result, fields) {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                    connection.release;
                    if (error) {
                        console.log(error);
                    }

                    res.status(201).json({
                        statusCode: 201,
                        result: results[1],
                    });
                }
            );
        });
    },

    getAllMeals: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "failed to connect to database",
                });
            }

            connection.query(
                "SELECT meal.id AS mealID, name, description, allergenes, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, user.id AS ParicipantID, user.firstName AS paricipantFirstName, user.lastName AS participantLastName, user.isActive AS participantIsActive, user.emailAdress AS participantEmailAdress, user.phoneNumber AS participantPhoneNumber, user.street AS participantStreet, user.city AS ParticipantCity, user.roles AS participantRoles from user RIGHT JOIN meal_participants_user ON user.id = meal_participants_user.userId LEFT JOIN meal ON meal_participants_user.mealId = meal.id ORDER BY meal.id ASC",

                function (error, meals, fields) {
                    if (error) {
                        console.log(error);
                    }
                    res.status(200).json({
                        statusCode: 200,
                        result: meals,
                    });
                }
            );

            connection.release();
        });
    },

    getMealById: (req, res) => {
        dbconnection.getConnection(function (err, connection) {
            const id = req.params.mealID;
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "failed to connect to server",
                });
            }

            connection.query(
                "SELECT meal.id AS mealID, name, description, allergenes, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate,  user.id AS ParicipantID, user.firstName AS paricipantFirstName, user.lastName AS participantLastName, user.isActive AS participantIsActive, user.emailAdress AS participantEmailAdress, user.phoneNumber AS participantPhoneNumber, user.street AS participantStreet, user.city AS ParticipantCity, user.roles AS participantRoles FROM meal JOIN meal_participants_user ON meal.id = meal_participants_user.userId JOIN user ON meal_participants_user.userId = user.id WHERE meal.id = ? ORDER BY meal.id ASC;",
                [id],
                function (error, meal, fields) {
                    if (error) {
                        console.log(error);
                    }

                    if (meal.length < 1) {
                        res.status(404).json({
                            statusCode: 404,
                            message: `meal with ID ${id} was not found`,
                        });
                    }
                    res.status(200).json({
                        statusCode: 200,
                        result: meal,
                    });
                }
            );
        });
    },

    //alternate version where participants are added to the same JSON object

    // getMealById: (req, res) => {
    //     dbconnection.getConnection(function (err, connection) {
    //         const id = req.params.mealID;
    //         let mealResult = [];
    //         if (err) {
    //             console.log(err);
    //             res.status(500).json({
    //                 statusCode: 500,
    //                 message: "failed to connect to server",
    //             });
    //         }

    //         connection.query(
    //             "SELECT * FROM meal WHERE id = ?",
    //             [id],

    //             function (error, meal, fields) {
    //                 if (error) {
    //                     console.log(error);
    //                 }

    //                 if (meal.length < 1) {
    //                     res.status(404).json({
    //                         statusCode: 404,
    //                         message: `meal with ID ${id} was not found`,
    //                     });
    //                 }
    //                 mealResult = meal;
    //             }
    //         );

    //         connection.query(
    //             "SELECT * FROM meal_participants_user JOIN user ON meal_participants_user.userId = user.id WHERE meal_participants_user.mealId = ?",
    //             [id],
    //             function (error, participants, fields) {
    //                 connection.release();
    //                 if (error) {
    //                     console.log(error);
    //                 }
    //                 mealResult = { ...mealResult, participants };
    //                 res.status(200).json({
    //                     statusCode: 200,
    //                     result: mealResult,
    //                 });
    //             }
    //         );
    //     });
    // },

    deleteMealById: (req, res) => {
        const id = req.params.mealID;
        const userID = req.userID;

        dbconnection.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "failed to connect to server",
                });
            }

            connection.query(
                "SELECT cookId FROM meal WHERE id = ?",
                [id],
                function (error, result, fields) {
                    connection.release();
                    if (error) {
                        console.log(error);
                    }

                    if (result.length < 1) {
                        res.status(404).json({
                            statusCode: 404,
                            message: "This meal does not exist",
                        });
                    }
                    const cookID = result[0].cookId;
                    if (userID === cookID) {
                        connection.query(
                            "DELETE FROM meal WHERE id = ?",
                            [id],
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                res.status(200).json({
                                    statusCode: 200,
                                    message: "meal has been deleted",
                                });
                            }
                        );
                    } else {
                        res.status(403).json({
                            statusCode: 403,
                            message: "you may only delete your own meals",
                        });
                    }
                }
            );
        });
    },

    updateMealById: (req, res) => {
        const id = req.params.mealID;

        const meal = req.body;
        const userID = req.userID;

        dbconnection.getConnection(function (err, connection) {
            if (err) {
                console.log(err);
                res.status(500).json({
                    statusCode: 500,
                    message: "failed to connect to server",
                });
            }

            connection.query(
                "SELECT cookId FROM meal WHERE id = ?",
                [id],
                function (error, result, fields) {
                    connection.release();
                    if (error) {
                        console.log(error);
                    }

                    if (result.length < 1) {
                        res.status(404).json({
                            statusCode: 404,
                            message: "This meal does not exist",
                        });
                    }
                    const cookID = result[0].cookId;
                    if (userID === cookID) {
                        const name = meal.name;
                        const description = meal.description;
                        const isActive = meal.isActive;
                        const isVega = meal.isVega;
                        const isVegan = meal.isVegan;
                        const isToTakeHome = meal.isToTakeHome;
                        const dateTime = new Date(meal.dateTime);
                        const imageUrl = meal.imageUrl;
                        const allergenes = req.body.allergenes.join(",");

                        const maxAmountOfParticipants =
                            meal.maxAmountOfParticipants;
                        const price = meal.price;
                        const updateDate = new Date();

                        connection.query(
                            "UPDATE meal SET isActive = ?, isVega = ?, isVegan = ? , isToTakeHome = ?, dateTime = ?, maxAmountOfParticipants = ?, price = ? , imageUrl = ?, updateDate = ?, name = ?, description = ?, allergenes = ? WHERE id = ?; SELECT * FROM meal WHERE id = ?;",

                            [
                                isActive,
                                isVega,
                                isVegan,
                                isToTakeHome,
                                dateTime,
                                maxAmountOfParticipants,
                                price,
                                imageUrl,
                                updateDate,
                                name,
                                description,
                                allergenes,
                                id,
                                id,
                            ],
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                res.status(200).json({
                                    statusCode: 200,
                                    result: results,
                                });
                            }
                        );
                    } else {
                        res.status(403).json({
                            statusCode: 403,
                            message: "you may only edit your own meals",
                        });
                    }
                }
            );
        });
    },
};

module.exports = mealController;
