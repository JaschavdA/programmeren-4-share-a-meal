// process.env.DB_DATABASE = process.env.DB_DATABASE || "share-a-meal-testdb";

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const server = require("../../index");
// const assert = require("assert");
// require("dotenv").config();
// const dbconnection = require("../../database/dbconnection");
// const res = require("express/lib/response");

// chai.should();
// chai.use(chaiHttp);

// /**
//  * Db queries to clear and fill the test database before each test.
//  */
// const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";
// const CLEAR_PARTICIPANTS_TABLE = "DELETE IGNORE FROM `meal_participants_user`;";
// const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
// const CLEAR_DB =
//     CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

// /**
//  * Voeg een user toe aan de database. Deze user heeft id 1.
//  * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
//  */
// const INSERT_USER =
//     "INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES" +
//     '(1, "first", "last", "name@server.nl", "secret", "street", "city");';

// /**
//  * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
//  * met een bestaande user in de database.
//  */
// const INSERT_MEALS =
//     "INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES" +
//     "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
//     "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);";

// // it("this is a test", (done) => {
// //     assert.equal(true, true);
// //     done();
// // });

// describe("share-a-meal API", () => {
//     beforeEach((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB + INSERT_USER);
//             done();
//         });
//     });

//     describe("UC 201 Registreren als nieuwe gebruiker", () => {
//         it("TC-201-1-1 Verplicht veld ontbreekt", function (done) {
//             chai.request(server)
//                 .post("/api/user/")
//                 .send({
//                     // firstName: "Jan",
//                     lastName: "Modaal",
//                     street: "Lovensdijkstraat 61",
//                     city: "Breda",
//                     password: "secret",
//                     emailAdress: "j.modaal@server.com",
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.be
//                         .an("object")
//                         .that.has.all.keys("statusCode", "message");
//                     const { statusCode, message } = res.body;
//                     statusCode.should.be.a("number");
//                     statusCode.should.equal(400);
//                     message.should.be.a("string");
//                     message.should.equal("firstName must be a string");

//                     done();
//                 });
//         });

//         it("TC-201-1-2 Verplicht veld ontbreekt", function (done) {
//             chai.request(server)
//                 .post("/api/user/")
//                 .send({
//                     firstName: "Jan",
//                     // lastName: "Modaal",
//                     street: "Lovensdijkstraat 61",
//                     city: "Breda",
//                     password: "secret",
//                     emailAdress: "j.modaal@server.com",
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.be
//                         .an("object")
//                         .that.has.all.keys("statusCode", "message");
//                     const { statusCode, message } = res.body;
//                     statusCode.should.be.a("number");
//                     statusCode.should.equal(400);
//                     message.should.be.a("string");
//                     message.should.equal("lastName must be a string");

//                     done();
//                 });
//         });

//         it("TC-201-1-3 Verplicht veld ontbreekt", function (done) {
//             chai.request(server)
//                 .post("/api/user/")
//                 .send({
//                     firstName: "Jan",
//                     lastName: "Modaal",
//                     // street: "Lovensdijkstraat 61",
//                     city: "Breda",
//                     password: "secret",
//                     emailAdress: "j.modaal@server.com",
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.be
//                         .an("object")
//                         .that.has.all.keys("statusCode", "message");
//                     const { statusCode, message } = res.body;
//                     statusCode.should.be.a("number");
//                     statusCode.should.equal(400);
//                     message.should.be.a("string");
//                     message.should.equal("street must be a string");

//                     done();
//                 });
//         });

//         it("TC-201-1-4 Verplicht veld ontbreekt", function (done) {
//             chai.request(server)
//                 .post("/api/user/")
//                 .send({
//                     firstName: "Jan",
//                     lastName: "Modaal",
//                     street: "Lovensdijkstraat 61",
//                     city: "Breda",
//                     password: "secret",
//                     // emailAdress: "j.modaal@server.com",
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.be
//                         .an("object")
//                         .that.has.all.keys("statusCode", "message");
//                     const { statusCode, message } = res.body;
//                     statusCode.should.be.a("number");
//                     statusCode.should.equal(400);
//                     message.should.be.a("string");
//                     message.should.equal("Email must be a string");

//                     done();
//                 });
//         });

//         it("TC-201-1-5 Verplicht veld ontbreekt", function (done) {
//             chai.request(server)
//                 .post("/api/user/")
//                 .send({
//                     firstName: "Jan",
//                     lastName: "Modaal",
//                     street: "Lovensdijkstraat 61",
//                     city: "Breda",
//                     //not sending password
//                     // password: "secret",
//                     emailAdress: "j.modaal@server.com",
//                 })
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.be
//                         .an("object")
//                         .that.has.all.keys("statusCode", "message");
//                     const { statusCode, message } = res.body;
//                     statusCode.should.be.a("number");
//                     statusCode.should.equal(400);
//                     message.should.be.a("string");
//                     message.should.equal("password may not be empty");

//                     done();
//                 });
//         });
//     });

//     // it("TC-201-1 Verplicht veld ontbreekt", function (done) {
//     //     chai.request(server)
//     //         .get("/api/user/")
//     //         .set({ Authorization: `Bearer ${token}` })
//     //         .then((res) => {
//     //             console.log(res.body);
//     //     done();
//     //         })
//     //         .catch((err) => done(err));
//     // });
// });

// // describe("share-a-meal API", () => {
// //   before((done) => {
// //     done();
// //     //INSERT INTO user (firstName, lastName, street, city, password, emailAdress) VALUES ('first', 'last', 'street', 'city', 'password', 'email@test.com');
// //   });

// //   describe("UC 201 Create user", () => {
// //     beforeEach((done) => {
// //       console.log("before each called");
// //       dbconnection.getConnection(function (err, connection) {
// //         if (err) throw err;
// //         connection.query(
// //           "DELETE IGNORE FROM user; ",
// //           function (error, results, fields) {
// //             if (error) throw error;
// //             if (error) {
// //               console.log(error);
// //             }
// //           }
// //         );

// //         connection.query(
// //           "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1, 'first', 'last', 'street', 'city', 'password', 'email@test.com');",
// //           function (error, results, fields) {
// //             connection.release;
// //             if (error) throw error;
// //             console.log("beforeEach done");
// //             if (error) {
// //               console.log(error);
// //             }

// //             done();
// //           }
// //         );
// //       });
// //     });
// //     it("TC-201-1 should return valid error when required value is not present", (done) => {
// //       chai
// //         .request(server)
// //         .post("/api/user")
// //         .send({
// //           //firstName is missing
// //           // firstName: "Henk",
// //           lastName: "De Graver",
// //           street: "Lovensdijkstraat 61",
// //           city: "Breda",
// //           password: "secret",
// //           emailAdress: "h.degraver@gmail.com",
// //         })
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(400);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be
// //             .an("object")
// //             .that.has.all.keys("status", "message");
// //           let { status, message } = res.body;
// //           status.should.be.a("number");
// //           message.should.be
// //             .a("string")
// //             .that.contains("firstName must be a string");
// //           done();
// //         });
// //     });

// //     //Since the Alternate Key constraint in MySQL handles keeping the Email unique and the error given by MySQL is what triggers the 409 response, it does not make sense to test
// //     //Wether a user is added here.
// //     it("TC-201-4 should return valid error when user already exists", (done) => {
// //       chai
// //         .request(server)
// //         .post("/api/user")
// //         .send({
// //           firstName: "Henk",
// //           lastName: "De Graver",
// //           street: "Lovensdijkstraat 61",
// //           city: "Breda",
// //           password: "secret",
// //           emailAdress: "email@test.com",
// //         })
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(409);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be
// //             .an("object")
// //             .that.has.all.keys("status", "message");
// //           let { status, message } = res.body;
// //           status.should.be.a("number");
// //           message.should.be
// //             .a("string")
// //             .that.contains(
// //               "There's already a user registered with this email address"
// //             );
// //           done();
// //         });
// //     });

// //     it("TC-201-5 should return valid response if user is added", (done) => {
// //       chai
// //         .request(server)
// //         .post("/api/user")
// //         .send({
// //           firstName: "Henk",
// //           lastName: "De Graver",
// //           street: "Lovensdijkstraat 61",
// //           city: "Breda",
// //           password: "secret",
// //           emailAdress: "h.degraver@gmail.com",
// //         })
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(201);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be.an("object").that.has.all.keys("status", "result");
// //           let { status, result } = res.body;
// //           status.should.be.a("number");
// //           result.should.be.an("object");
// //           let { firstName, lastName, street, city, password, emailAdress } =
// //             result;
// //           firstName.should.be.a("string").that.contains("Henk");
// //           lastName.should.be.a("string").that.contains("De Graver");
// //           street.should.be.a("string").that.contains("Lovensdijkstraat 61");
// //           city.should.be.a("string").that.contains("Breda");
// //           password.should.be.a("string").that.contains("secret");
// //           emailAdress.should.be
// //             .a("string")
// //             .that.contains("h.degraver@gmail.com");
// //         });
// //       done();
// //     });
// //   });

// //   describe("UC 202 get user", () => {
// //     beforeEach((done) => {
// //       console.log("before each called");
// //       dbconnection.getConnection(function (err, connection) {
// //         if (err) throw err;
// //         connection.query(
// //           "DELETE IGNORE FROM user; ",
// //           function (error, results, fields) {
// //             connection.release;
// //             if (error) throw error;
// //             console.log("beforeEach done");
// //             if (error) {
// //               console.log(error);
// //             }

// //             done();
// //           }
// //         );
// //       });
// //     });
// //     it("TC-202-1 should return empty list if DB is empty", (done) => {
// //       chai
// //         .request(server)
// //         .get("/api/user")
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(200);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be.an("object").that.has.all.keys("status", "result");
// //           let { status, result } = res.body;
// //           status.should.be.a("number");
// //           result.should.be.an("array").that.has.length(0);

// //           done();
// //         });
// //     });

// //     describe("UC 202 get user", () => {
// //       beforeEach((done) => {
// //         console.log("before each called");
// //         dbconnection.getConnection(function (err, connection) {
// //           connection.query(
// //             "DELETE IGNORE FROM user; ",
// //             function (error, results, fields) {
// //               if (error) throw error;
// //               console.log("beforeEach done");
// //             }
// //           );

// //           if (err) throw err;
// //           connection.query(
// //             "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1,'first', 'last', 'street', 'city', 'password', 'email@test.com');",
// //             function (error, results, fields) {
// //               if (error) throw error;
// //               console.log("beforeEach done");
// //             }
// //           );

// //           connection.query(
// //             "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (2, 'first2', 'last2', 'street2', 'city2', 'password2', 'email@test2.com');",
// //             function (error, results, fields) {
// //               connection.release;
// //               if (error) throw error;
// //               console.log("beforeEach done");
// //               done();
// //             }
// //           );
// //         });
// //       });

// //       it("TC-202-2 should 2 correct items if DB has 2 items", (done) => {
// //         chai
// //           .request(server)
// //           .get("/api/user")
// //           .end((err, res) => {
// //             assert.ifError(err);
// //             res.should.have.status(200);
// //             res.should.be.an("object");
// //             res.body.should.be.an("object");
// //             res.body.should.be
// //               .an("object")
// //               .that.has.all.keys("status", "result");
// //             let { status, result } = res.body;
// //             status.should.be.a("number");
// //             result.should.be.an("array").that.has.length(2);
// //             result[0].emailAdress.should.equal("email@test.com");
// //             result[1].emailAdress.should.equal("email@test2.com");

// //             done();
// //           });
// //       });
// //   });

// //   describe("UC 202 get user", () => {
// //     beforeEach((done) => {
// //       dbconnection.getConnection(function (err, connection) {
// //         connection.query(
// //           "DELETE IGNORE FROM user; ",
// //           function (error, results, fields) {
// //             if (error) {
// //               console.log(error);
// //             }
// //           }
// //         );

// //         if (err) throw err;
// //         connection.query(
// //           "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1,'first', 'last', 'street', 'city', 'password', 'email@test.com');",
// //           function (error, results, fields) {
// //             if (error) {
// //               console.log(error);
// //             }
// //           }
// //         );

// //         connection.query(
// //           "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (2, 'first2', 'last2', 'street2', 'city2', 'password2', 'email@test2.com');",
// //           function (error, results, fields) {
// //             connection.release;
// //             if (error) {
// //               console.log(error);
// //             }
// //           }
// //         );
// //         done();
// //       });
// //     });

// //     it("TC-202-2 should 2 correct items if DB has 2 items", (done) => {
// //       chai
// //         .request(server)
// //         .get("/api/user")
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(200);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be.an("object").that.has.all.keys("status", "result");
// //           let { status, result } = res.body;
// //           status.should.be.a("number");
// //           result.should.be.an("array").that.has.length(2);
// //           result[0].emailAdress.should.equal("email@test.com");
// //           result[1].emailAdress.should.equal("email@test2.com");

// //           done();
// //         });
// //     });
// //   });

// //   describe("UC 203 get profile", () => {
// //     beforeEach((done) => {
// //       console.log("before each called");
// //       dbconnection.getConnection(function (err, connection) {
// //         if (err) throw err;
// //         connection.query(
// //           "DELETE IGNORE FROM user; ",
// //           function (error, results, fields) {
// //             connection.release;
// //             if (error) throw error;
// //             console.log("beforeEach done");
// //             if (error) {
// //               console.log(error);
// //             }

// //             done();
// //           }
// //         );
// //       });
// //     });

// //     it("TC-203-1 should correct response", (done) => {
// //       chai
// //         .request(server)
// //         .get("/api/user/profile")
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(501);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be
// //             .an("object")
// //             .that.has.all.keys("status", "message");
// //           let { status, message } = res.body;
// //           status.should.be.a("number");
// //           message.should.be.a("string").that.contains("not yet implemented");

// //           done();
// //         });
// //     });
// //   });

// //   describe("UC 204 get profile by ID", () => {
// //     beforeEach((done) => {
// //       console.log("before each called");
// //       dbconnection.getConnection(function (err, connection) {
// //         connection.query(
// //           "DELETE IGNORE FROM user; ",
// //           function (error, results, fields) {
// //             if (error) throw error;
// //             if (error) {
// //               console.log(error);
// //             }
// //           }
// //         );
// //         if (err) throw err;
// //         connection.query(
// //           "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1, 'first', 'last', 'street', 'city', 'password', 'email@test.com');",
// //           function (error, results, fields) {
// //             console.log(results);
// //             connection.release;
// //             if (error) throw error;
// //             connection.release;
// //             if (error) {
// //               console.log(error);
// //             }
// //             console.log("beforeEach done");
// //             done();
// //           }
// //         );
// //       });
// //     });

// //     it("TC-204-3 should give correct user if ID is found", (done) => {
// //       chai
// //         .request(server)
// //         .get("/api/user/1")
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(200);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be.an("object").that.has.all.keys("status", "result");
// //           let { status, result } = res.body;
// //           status.should.be.a("number");
// //           result.should.be.an("array").that.has.length(1);
// //           result[0].id.should.equal(1);
// //           result[0].firstName.should.equal("first");
// //           result[0].lastName.should.equal("last");
// //           result[0].street.should.equal("street");
// //           result[0].city.should.equal("city");
// //           result[0].password.should.equal("password");
// //           result[0].emailAdress.should.equal("email@test.com");
// //           done();
// //         });
// //     });

// //     // it("TC205-should give a correct error message if the user does not exits", (done) => {
// //     //   chai.request(server).put("/api/user/1");
// //     // });

// //     it("TC-206-1 should give correct user if ID is not found", (done) => {
// //       chai
// //         .request(server)
// //         .delete("/api/user/2")
// //         .end((err, res) => {
// //           assert.ifError(err);
// //           res.should.have.status(400);
// //           res.should.be.an("object");
// //           res.body.should.be.an("object");
// //           res.body.should.be
// //             .an("object")
// //             .that.has.all.keys("status", "message");
// //           let { status, message } = res.body;
// //           status.should.be.a("number");
// //           message.should.be
// //             .a("string")
// //             .that.equals("user with id: 2 could not be found");
// //           done();
// //         });
// //     });
// //   });

// //   it("TC-206-2 should give correct user if ID is found", (done) => {
// //   it("TC-204-3 should give correct user if ID is found", (done) => {
// //     chai
// //       .request(server)
// //       .get("/api/user/1")
// //       .end((err, res) => {
// //         assert.ifError(err);
// //         res.should.have.status(200);
// //         res.should.be.an("object");
// //         res.body.should.be.an("object");
// //         res.body.should.be.an("object").that.has.all.keys("status", "result");
// //         let { status, result } = res.body;
// //         status.should.be.a("number");
// //         result.should.be.an("array").that.has.length(1);
// //         result[0].id.should.equal(1);
// //         result[0].firstName.should.equal("first");
// //         result[0].lastName.should.equal("last");
// //         result[0].street.should.equal("street");
// //         result[0].city.should.equal("city");
// //         result[0].password.should.equal("password");
// //         result[0].emailAdress.should.equal("email@test.com");
// //         done();
// //       });
// //   });

// //   it("TC-206-1 should give correct user if ID is found", (done) => {
// //     chai
// //       .request(server)
// //       .delete("/api/user/1")
// //       .end((err, res) => {
// //         assert.ifError(err);
// //         res.should.have.status(200);
// //         res.should.be.an("object");
// //         res.body.should.be.an("object");
// //         res.body.should.be.an("object").that.has.all.keys("status", "message");
// //         let { status, message } = res.body;
// //         status.should.be.a("number");
// //         message.should.be
// //           .a("string")
// //           .that.has.contains("user with id: 1 has been deleted");
// //         done();
// //       });
// //   });

// //   it("TC-204-2 should give valid error message if ID isn't found", (done) => {
// //     chai
// //       .request(server)
// //       .get("/api/user/2")
// //       .end((err, res) => {
// //         assert.ifError(err);
// //         res.should.have.status(404);
// //         res.should.be.an("object");
// //         res.body.should.be.an("object");
// //         res.body.should.be.an("object").that.has.all.keys("status", "message");
// //         let { status, message } = res.body;
// //         status.should.be.a("number");
// //         message.should.be
// //           .a("string")
// //           .that.contains("User with id: 2 was not found");
// //         done();
// //       });
// //   });
// // });

process.env.DB_DATABASE = process.env.DB_DATABASE || "share-a-meal-testdb";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const assert = require("assert");
require("dotenv").config();
const dbconnection = require("../../database/dbconnection");
const res = require("express/lib/response");

chai.should();
chai.use(chaiHttp);

describe("share-a-meal API", () => {
    before((done) => {
        console.log(
            "before: hier zorg je eventueel dat de precondities correct zijn"
        );
        console.log("before done");
        done();
        //INSERT INTO user (firstName, lastName, street, city, password, emailAdress) VALUES ('first', 'last', 'street', 'city', 'password', 'email@test.com');
    });

    describe("UC 201 Create user", () => {
        beforeEach((done) => {
            console.log("before each called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    "DELETE IGNORE FROM user; ",
                    function (error, results, fields) {
                        if (error) throw error;
                    }
                );

                connection.query(
                    "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1, 'first', 'last', 'street', 'city', 'password', 'email@test.com');",
                    function (error, results, fields) {
                        connection.release;
                        if (error) throw error;
                        console.log("beforeEach done");
                        done();
                    }
                );
            });
        });
        it("TC-201-1 should return valid error when required value is not present", (done) => {
            chai.request(server)
                .post("/api/user")
                .send({
                    //firstName is missing
                    // firstName: "Henk",
                    lastName: "De Graver",
                    street: "Lovensdijkstraat 61",
                    city: "Breda",
                    password: "secret",
                    emailAdress: "h.degraver@gmail.com",
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "message");
                    let { status, message } = res.body;
                    status.should.be.a("number");
                    message.should.be
                        .a("string")
                        .that.contains("firstName must be a string");
                    done();
                });
        });

        //Since the Alternate Key constraint in MySQL handles keeping the Email unique and the error given by MySQL is what triggers the 409 response, it does not make sense to test
        //Wether a user is added here.
        it("TC-201-4 should return valid error when user already exists", (done) => {
            chai.request(server)
                .post("/api/user")
                .send({
                    firstName: "Henk",
                    lastName: "De Graver",
                    street: "Lovensdijkstraat 61",
                    city: "Breda",
                    password: "secret",
                    emailAdress: "email@test.com",
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(409);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "message");
                    let { status, message } = res.body;
                    status.should.be.a("number");
                    message.should.be
                        .a("string")
                        .that.contains(
                            "There's already a user registered with this email address"
                        );
                    done();
                });
        });

        it("TC-201-5 should return valid response if user is added", (done) => {
            chai.request(server)
                .post("/api/user")
                .send({
                    firstName: "Henk",
                    lastName: "De Graver",
                    street: "Lovensdijkstraat 61",
                    city: "Breda",
                    password: "secret",
                    emailAdress: "h.degraver@gmail.com",
                })
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(201);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "result");
                    let { status, result } = res.body;
                    status.should.be.a("number");
                    result.should.be.an("object");
                    let {
                        firstName,
                        lastName,
                        street,
                        city,
                        password,
                        emailAdress,
                    } = result;
                    firstName.should.be.a("string").that.contains("Henk");
                    lastName.should.be.a("string").that.contains("De Graver");
                    street.should.be
                        .a("string")
                        .that.contains("Lovensdijkstraat 61");
                    city.should.be.a("string").that.contains("Breda");
                    password.should.be.a("string").that.contains("secret");
                    emailAdress.should.be
                        .a("string")
                        .that.contains("h.degraver@gmail.com");
                });
            done();
        });
    });

    describe("UC 202 get user", () => {
        beforeEach((done) => {
            console.log("before each called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    "DELETE IGNORE FROM user; ",
                    function (error, results, fields) {
                        connection.release;
                        if (error) throw error;
                        console.log("beforeEach done");
                        done();
                    }
                );
            });
        });
        it("TC-202-1 should return empty list if DB is empty", (done) => {
            chai.request(server)
                .get("/api/user")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "result");
                    let { status, result } = res.body;
                    status.should.be.a("number");
                    result.should.be.an("array").that.has.length(0);

                    done();
                });
        });

        describe("UC 202 get user", () => {
            beforeEach((done) => {
                console.log("before each called");
                dbconnection.getConnection(function (err, connection) {
                    connection.query(
                        "DELETE IGNORE FROM user; ",
                        function (error, results, fields) {
                            if (error) throw error;
                            console.log("beforeEach done");
                        }
                    );

                    if (err) throw err;
                    connection.query(
                        "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1,'first', 'last', 'street', 'city', 'password', 'email@test.com');",
                        function (error, results, fields) {
                            if (error) throw error;
                            console.log("beforeEach done");
                        }
                    );

                    connection.query(
                        "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (2, 'first2', 'last2', 'street2', 'city2', 'password2', 'email@test2.com');",
                        function (error, results, fields) {
                            connection.release;
                            if (error) throw error;
                            console.log("beforeEach done");
                            done();
                        }
                    );
                });
            });

            it("TC-202-2 should 2 correct items if DB has 2 items", (done) => {
                chai.request(server)
                    .get("/api/user")
                    .end((err, res) => {
                        assert.ifError(err);
                        res.should.have.status(200);
                        res.should.be.an("object");
                        res.body.should.be.an("object");
                        res.body.should.be
                            .an("object")
                            .that.has.all.keys("status", "result");
                        let { status, result } = res.body;
                        status.should.be.a("number");
                        result.should.be.an("array").that.has.length(2);
                        result[0].emailAdress.should.equal("email@test.com");
                        result[1].emailAdress.should.equal("email@test2.com");

                        done();
                    });
            });
        });
    });

    describe("UC 203 get profile", () => {
        beforeEach((done) => {
            console.log("before each called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    "DELETE IGNORE FROM user; ",
                    function (error, results, fields) {
                        connection.release;
                        if (error) throw error;
                        console.log("beforeEach done");
                        done();
                    }
                );
            });
        });

        it("TC-203-1 should correct response", (done) => {
            chai.request(server)
                .get("/api/user/profile")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(501);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "message");
                    let { status, message } = res.body;
                    status.should.be.a("number");
                    message.should.be
                        .a("string")
                        .that.contains("not yet implemented");

                    done();
                });
        });
    });

    describe("UC 204 get profile by ID", () => {
        beforeEach((done) => {
            console.log("before each called");
            dbconnection.getConnection(function (err, connection) {
                connection.query(
                    "DELETE IGNORE FROM user; ",
                    function (error, results, fields) {
                        if (error) throw error;
                    }
                );
                if (err) throw err;
                connection.query(
                    "INSERT INTO user (id, firstName, lastName, street, city, password, emailAdress) VALUES (1, 'first', 'last', 'street', 'city', 'password', 'email@test.com');",
                    function (error, results, fields) {
                        console.log(results);
                        connection.release;
                        if (error) throw error;
                        console.log("beforeEach done");
                        done();
                    }
                );
            });
        });

        it("TC-204-3 should give correct user if ID is found", (done) => {
            chai.request(server)
                .get("/api/user/1")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(200);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "result");
                    let { status, result } = res.body;
                    status.should.be.a("number");
                    result.should.be.an("array").that.has.length(1);
                    result[0].id.should.equal(1);
                    result[0].firstName.should.equal("first");
                    result[0].lastName.should.equal("last");
                    result[0].street.should.equal("street");
                    result[0].city.should.equal("city");
                    result[0].password.should.equal("password");
                    result[0].emailAdress.should.equal("email@test.com");
                    done();
                });
        });

        // it("TC205-should give a correct error message if the user does not exits", (done) => {
        //   chai.request(server).put("/api/user/1");
        // });

        it("TC-206-1 should give correct user if ID is not found", (done) => {
            chai.request(server)
                .delete("/api/user/2")
                .end((err, res) => {
                    assert.ifError(err);
                    res.should.have.status(400);
                    res.should.be.an("object");
                    res.body.should.be.an("object");
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("status", "message");
                    let { status, message } = res.body;
                    status.should.be.a("number");
                    message.should.be
                        .a("string")
                        .that.equals("user with id: 2 could not be found");
                    done();
                });
        });
    });

    it("TC-206-2 should give correct user if ID is found", (done) => {
        chai.request(server)
            .delete("/api/user/1")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(200);
                res.should.be.an("object");
                res.body.should.be.an("object");
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("status", "message");
                let { status, message } = res.body;
                status.should.be.a("number");
                message.should.be
                    .a("string")
                    .that.has.contains("user with id: 1 has been deleted");
                done();
            });
    });

    it("TC-204-2 should give valid error message if ID isn't found", (done) => {
        chai.request(server)
            .get("/api/user/2")
            .end((err, res) => {
                assert.ifError(err);
                res.should.have.status(404);
                res.should.be.an("object");
                res.body.should.be.an("object");
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("status", "message");
                let { status, message } = res.body;
                status.should.be.a("number");
                message.should.be
                    .a("string")
                    .that.contains("User with id: 2 was not found");
                done();
            });
    });
});
