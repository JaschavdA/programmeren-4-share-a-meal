process.env.DB_DATABASE = process.env.DB_DATABASE || "share-a-meal-testdb";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const assert = require("assert");
require("dotenv").config();
const dbconnection = require("../../database/dbconnection");
const res = require("express/lib/response");
const { getPriority } = require("os");
const jwtSecretKey = process.env.JWT_Key;
const jwt = require("jsonwebtoken");
const { beforeEach } = require("mocha");
const { type } = require("express/lib/response");

chai.should();
chai.use(chaiHttp);

/**
 * Db queries to clear and fill the test database before each test.
 */

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUzMjM5ODI2LCJleHAiOjE2NTQyNzY2MjZ9.Vn--roSUWkn91Ekn7wWMvZjP3CWNViToWRRQybFVEx0";
const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";
const CLEAR_PARTICIPANTS_TABLE = "DELETE IGNORE FROM `meal_participants_user`;";
const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
const CLEAR_DB =
    CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLE;

/**
 * Voeg een user toe aan de database. Deze user heeft id 1.
 * Deze id kun je als foreign key gebruiken in de andere queries, bv insert meal.
 */
const INSERT_USER =
    "INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES" +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city");';

const INSERT_USER2 =
    "INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES" +
    '(2, "first2", "last2", "name@server2.nl", "secret2", "street2", "city2");';

/**
 * Query om twee meals toe te voegen. Let op de cookId, die moet matchen
 * met een bestaande user in de database.
 */
const INSERT_MEALS = `INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES (1, 1, 1, 1, 1, '2022-05-22T20:06:49.131Z', 1, 1, 'test.nl', 1, '2022-05-22T20:06:49.131Z', '2022-05-22T20:06:49.131Z', 'test', 'test', 'gluten,lactose,noten');`;

// it("this is a test", (done) => {
//     assert.equal(true, true);
//     done();
// });

describe("UC 201 Registreren als nieuwe gebruiker deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-1-1 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                // firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "j.modaal@server.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal("firstName must be a string");

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });

        it("TC-201-1-2 Verplicht veld ontbreekt", function (done) {
            chai.request(server)
                .post("/api/user/")
                .send({
                    firstName: "Jan",
                    // lastName: "Modaal",
                    street: "Lovensdijkstraat 61",
                    city: "Breda",
                    password: "secret",
                    emailAdress: "j.modaal@server.com",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be
                        .an("object")
                        .that.has.all.keys("statusCode", "message");
                    const { statusCode, message } = res.body;
                    statusCode.should.be.a("number");
                    statusCode.should.equal(400);
                    message.should.be.a("string");
                    message.should.equal("lastName must be a string");

                    done();
                });
        });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-1-3 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                // street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "j.modaal@server.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal("street must be a string");

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 4", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-1-4 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                // emailAdress: "j.modaal@server.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal("Email must be a string");

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 5", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-1-5 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                //not sending password
                // password: "secret",
                emailAdress: "j.modaal@server.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal("password must be a string");

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 6", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-2 Niet-valide email adres", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "google.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal("please enter a valid emailAdress");

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 7", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-3 Niet-valide wachtwoord", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "",
                emailAdress: "j.modaal@server.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(400);
                message.should.be.a("string");
                message.should.equal(
                    "password must be at least 6 characters long"
                );

                done();
            });
    });
});

describe("UC 201 Registreren als nieuwe gebruiker deel 8", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-201-4 Gebruiker bestaat al", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                //user with this email already exists
                emailAdress: "name@server.nl",
            })
            .end((err, res) => {
                res.should.have.status(409);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;
                statusCode.should.be.a("number");
                statusCode.should.equal(409);
                message.should.be.a("string");
                message.should.equal(
                    "A user with emailAdres name@server.nl already exists"
                );

                done();
            });
    });
});

// describe("UC 202 Overzicht van gebruikers deel 1", () => {
//     before((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB);
//             connection.release();
//             done();
//         });
//     });

//     it("TC-202-1 Toon nul gebruikers", function (done) {
//         chai.request(server)
//             .get("/api/user/")
//             .end((err, res) => {
//                 console.log("test");
//                 done();
//             });
//     });
// });

describe("UC 201 Registreren als nieuwe gebruiker deel 9", () => {
    it("TC-201-5 Gebruiker succesvol geregistreerd", function (done) {
        chai.request(server)
            .post("/api/user/")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "test@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                const { statusCode, result } = res.body;
                result[0].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                //cant test id because of autoincrement
                const {
                    firstName,
                    lastName,
                    isActive,
                    emailAdress,
                    password,
                    phoneNumber,
                    roles,
                    street,
                    city,
                } = result[0];
                firstName.should.be.a("string").that.contains("Jan");
                lastName.should.be.a("string").that.contains("Modaal");
                isActive.should.equal(1);
                emailAdress.should.be
                    .a("string")
                    .that.contains("test@gmail.com");
                password.should.be.a("string").that.contains("secret");
                phoneNumber.should.be.a("string").that.contains("-");
                roles.should.be.a("string").that.contains("editor,guest");
                street.should.be
                    .a("string")
                    .that.contains("Lovensdijkstraat 61");
                city.should.be.a("string").that.contains("Breda");
                done();
            });
    });
});

describe("UC 202", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB);
            connection.release();
            done();
        });
    });

    it("TC-202-1 Toon nul gebruikers", function (done) {
        chai.request(server)
            .get("/api/user/")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);
                res.body.result.length.should.equal(0);
                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 202 deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();
            done();
        });
    });

    it("TC-202-2 Toon twee gebruikers", function (done) {
        chai.request(server)
            .get("/api/user/")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                const { statusCode, result } = res.body;
                result[0].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                const {
                    id,
                    firstName,
                    lastName,
                    isActive,
                    emailAdress,
                    password,
                    phoneNumber,
                    roles,
                    street,
                    city,
                } = result[0];
                id.should.be.a("number").that.equals(1);
                firstName.should.be.a("string").that.equals("first");
                lastName.should.be.a("string").that.equals("last");
                isActive.should.equal(1);
                emailAdress.should.be.a("string").that.equals("name@server.nl");
                password.should.be.a("string").that.equals("secret");
                phoneNumber.should.be.a("string").that.equals("-");
                roles.should.be.a("string").that.equals("editor,guest");
                street.should.be.a("string").that.equals("street");
                city.should.be.a("string").that.equals("city");

                result[1].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                result[1].id.should.be.a("number").that.equals(2);
                result[1].firstName.should.be.a("string").that.equals("first2");
                result[1].lastName.should.be.a("string").that.equals("last2");
                result[1].isActive.should.equal(1);
                result[1].emailAdress.should.be
                    .a("string")
                    .that.equals("name@server2.nl");
                result[1].password.should.be.a("string").that.equals("secret2");
                result[1].phoneNumber.should.be.a("string").that.equals("-");
                result[1].roles.should.be
                    .a("string")
                    .that.equals("editor,guest");
                result[1].street.should.be.a("string").that.equals("street2");
                result[1].city.should.be.a("string").that.equals("city2");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 202 deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-202-3 Toon gebruikers met zoekterm op niet-bestaande naam ", function (done) {
        chai.request(server)
            .get("/api/user?firstName=Henk")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);
                res.body.result.length.should.equal(0);

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 202 deel 4", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=false", function (done) {
        chai.request(server)
            .get("/api/user?isActive=0")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                //There are no users with isActive equals false
                res.should.have.status(200);
                res.body.result.length.should.equal(0);

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 202 deel 4", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();
            done();
        });
    });

    it("TC-202-5 Toon gebruikers met gebruik van de zoekterm op het veld ‘isActive’=true", function (done) {
        chai.request(server)
            .get("/api/user?isActive=1")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                //There are no users with isActive equals false
                res.should.have.status(200);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                const { statusCode, result } = res.body;
                result[0].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                const {
                    id,
                    firstName,
                    lastName,
                    isActive,
                    emailAdress,
                    password,
                    phoneNumber,
                    roles,
                    street,
                    city,
                } = result[0];
                id.should.be.a("number").that.equals(1);
                firstName.should.be.a("string").that.equals("first");
                lastName.should.be.a("string").that.equals("last");
                isActive.should.equal(1);
                emailAdress.should.be.a("string").that.equals("name@server.nl");
                password.should.be.a("string").that.equals("secret");
                phoneNumber.should.be.a("string").that.equals("-");
                roles.should.be.a("string").that.equals("editor,guest");
                street.should.be.a("string").that.equals("street");
                city.should.be.a("string").that.equals("city");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 202 deel 5", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });

    it("TC-202-6 Toon gebruikers met zoekterm op bestaande naam (max op 2 velden filteren)", function (done) {
        chai.request(server)
            .get("/api/user?firstName=first&isActive=1")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                //There are no users with isActive equals false
                res.should.have.status(200);
                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                console.log(res.body);
                res.body.result[0].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                res.body.result[0].id.should.be.a("number").that.equals(1);
                res.body.result[0].firstName.should.be
                    .a("string")
                    .that.equals("first");
                res.body.result[0].lastName.should.be
                    .a("string")
                    .that.equals("last");
                res.body.result[0].isActive.should.equal(1);
                res.body.result[0].emailAdress.should.be
                    .a("string")
                    .that.equals("name@server.nl");
                res.body.result[0].password.should.be
                    .a("string")
                    .that.equals("secret");
                res.body.result[0].phoneNumber.should.be
                    .a("string")
                    .that.equals("-");
                res.body.result[0].roles.should.be
                    .a("string")
                    .that.equals("editor,guest");
                res.body.result[0].street.should.be
                    .a("string")
                    .that.equals("street");
                res.body.result[0].city.should.be
                    .a("string")
                    .that.equals("city");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 203 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();
            done();
        });
    });

    it("TC-203-1 Ongeldig token", function (done) {
        chai.request(server)
            .get("/api/user?firstName=first2&isActive=1")
            .set({ Authorization: `Bearer henk` })
            .then((res) => {
                //There are no users with isActive equals false

                res.should.have.status(401);

                res.body.should.be
                    .a("object")
                    .that.has.all.keys("statusCode", "message", "dateTime");

                const { statusCode, message, dateTime } = res.body;

                statusCode.should.be.a("number").that.equals(401);
                message.should.be.a("string").that.equals("Invalid token");
                dateTime.should.be.a("string");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 203 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-203-2 Valide token en gebruiker bestaat.", function (done) {
        chai.request(server)
            .get("/api/user/profile")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);

                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                const { statusCode, result } = res.body;
                result.should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                result.id.should.be.a("number").that.equals(1);
                result.firstName.should.be.a("string").that.equals("first");
                result.lastName.should.be.a("string").that.equals("last");
                result.isActive.should.equal(1);
                result.emailAdress.should.be
                    .a("string")
                    .that.equals("name@server.nl");
                result.password.should.be.a("string").that.equals("secret");
                result.phoneNumber.should.be.a("string").that.equals("-");
                result.roles.should.be.a("string").that.equals("editor,guest");
                result.street.should.be.a("string").that.equals("street");
                result.city.should.be.a("string").that.equals("city");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 204 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();
            done();
        });
    });

    it("TC-204-1 Ongeldig token", function (done) {
        chai.request(server)
            .get("/api/user/5")
            .set({ Authorization: `Bearer henk` })
            .then((res) => {
                //There are no users with isActive equals false

                res.should.have.status(401);

                res.body.should.be
                    .a("object")
                    .that.has.all.keys("statusCode", "message", "dateTime");

                const { statusCode, message, dateTime } = res.body;

                statusCode.should.be.a("number").that.equals(401);
                message.should.be.a("string").that.equals("Invalid token");
                dateTime.should.be.a("string");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 204 deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-204-2 gebruiker bestaat niet", function (done) {
        chai.request(server)
            .get("/api/user/3")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(404);

                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "message");
                const { statusCode, message } = res.body;

                statusCode.should.be.a("number").that.equals(404);
                message.should.be
                    .a("string")
                    .that.equals("User with id: 3 was not found");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 203 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-203-2 Valide token en gebruiker bestaat.", function (done) {
        chai.request(server)
            .get("/api/user/1")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);

                res.body.should.be
                    .an("object")
                    .that.has.all.keys("statusCode", "result");
                const { statusCode, result } = res.body;

                result[0].should.be
                    .a("object")
                    .that.has.all.keys(
                        "id",
                        "firstName",
                        "lastName",
                        "isActive",
                        "emailAdress",
                        "password",
                        "phoneNumber",
                        "roles",
                        "street",
                        "city"
                    );

                result[0].id.should.be.a("number").that.equals(1);
                result[0].firstName.should.be.a("string").that.equals("first");
                result[0].lastName.should.be.a("string").that.equals("last");
                result[0].isActive.should.equal(1);
                result[0].emailAdress.should.be
                    .a("string")
                    .that.equals("name@server.nl");
                result[0].password.should.be.a("string").that.equals("secret");
                result[0].phoneNumber.should.be.a("string").that.equals("-");
                result[0].roles.should.be
                    .a("string")
                    .that.equals("editor,guest");
                result[0].street.should.be.a("string").that.equals("street");
                result[0].city.should.be.a("string").that.equals("city");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 205 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-205-1 Verplicht veld “emailAdress” ontbreek", function (done) {
        chai.request(server)
            .put("/api/user/1")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                // emailAdress: "j.modaal@server.com"
            })
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("Email must be a string");

                done();
            })
            .catch((err) => done(err));
    });
});

//Dit is volgens documentatie maar veroorzaakt nog steeds een error zie https://www.chaijs.com/plugins/chai-http/

// describe("UC 205 deel 2", () => {
//     before((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
//             connection.release();

//             done();
//         });
//     });

//     it("TC-205-1 Verplicht veld “emailAdress” ontbreek", function (done) {
//         chai.request(server)
//             .put("/api/user/1")
//             .send({
//                 firstName: "Jan",
//                 lastName: "Modaal",
//                 street: "Lovensdijkstraat 61",
//                 city: "Breda",
//                 password: "secret",
//                 emailAdress: "j.modaal@server.com",
//             })
//             .set({ Authorization: `Bearer ${token}` })
//             .then((res) => {
//                 res.should.have.status(400);
//                 res.body.message.should.be
//                     .a("string")
//                     .that.equals("please enter a valid phone number");

//                 done();
//             })
//             .catch((err) => done(err));
//     });
// });

describe("UC 205 deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-205-1 gebruiker is geupdate", function (done) {
        chai.request(server)
            .put("/api/user/1")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "j.modaal@server.com",
                phoneNumber: "123456",
            })
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("user with id: 1 could not be found");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 205 deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-205-1 gebruiker is geupdate", function (done) {
        chai.request(server)
            .put("/api/user/1")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "j.modaal@server.com",
                phoneNumber: "123456",
            })
            .set({ Authorization: `Bearer ` })
            .then((res) => {
                res.should.have.status(401);
                res.body.message.should.be
                    .a("string")
                    .that.equals("Invalid token");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 205 deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-205-1 gebruiker is geupdate", function (done) {
        chai.request(server)
            .put("/api/user/1")
            .send({
                firstName: "Jan",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "j.modaal@server.com",
                phoneNumber: "123456",
            })
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);
                // res.body.message.should.be
                //     .a("string")
                //     .that.equals("Email must be a string");
                console.log(res.body);
                res.body.result.should.be
                    .a("string")
                    .that.equals("User Successfully updated");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 206 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-206-1 Gebruiker bestaat niet", function (done) {
        chai.request(server)
            .delete("/api/user/1")

            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                console.log(res.body);
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("user with id: 1 could not be found");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 206 deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-206-2 niet ingelogd", function (done) {
        chai.request(server)
            .delete("/api/user/1")
            .set({ Authorization: `Bearer ` })
            .then((res) => {
                res.should.have.status(401);
                res.body.message.should.be
                    .a("string")
                    .that.equals("Invalid token");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 206 deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-206-2 niet eigenaar", function (done) {
        chai.request(server)
            .delete("/api/user/2")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(403);
                res.body.message.should.be
                    .a("string")
                    .that.equals("You may only delete your own account");

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 206 deel 4", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
            connection.release();

            done();
        });
    });
    it("TC-206-2 sucess verwijdert", function (done) {
        chai.request(server)
            .delete("/api/user/1")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                res.should.have.status(200);
                res.body.message.should.be
                    .a("string")
                    .that.equals("user with id: 1 has been deleted");

                console.log(res.body);
                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 301 maaltijd aanmaken deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-203-1 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/meal/")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Krabbenburger",
                // description: "De legendarische Krabbenburger, gemaakt met aan hand van het begaarde geheime recept van de Krokante Krab",
                isActive: 1,
                isVega: 1,
                isVegan: 1,
                isToTakeHome: 1,
                dateTime: "2022-05-21T11:13:11.932Z",
                imageUrl:
                    "https://i1.sndcdn.com/artworks-uYTqpAuEizvDbNvj-xNF8sw-t500x500.jpg",
                allergenes: ["gluten", "noten", "lactose"],
                maxAmountOfParticipants: 6,
                price: 6.75,
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("description must be a string");

                done();
            });
    });
});

describe("UC 301 maaltijd aanmaken deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-203-2 niet ingelogd", function (done) {
        chai.request(server)
            .post("/api/meal/")
            // .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Krabbenburger",
                description:
                    "De legendarische Krabbenburger, gemaakt met aan hand van het begaarde geheime recept van de Krokante Krab",
                isActive: 1,
                isVega: 1,
                isVegan: 1,
                isToTakeHome: 1,
                dateTime: "2022-05-21T11:13:11.932Z",
                imageUrl:
                    "https://i1.sndcdn.com/artworks-uYTqpAuEizvDbNvj-xNF8sw-t500x500.jpg",
                allergenes: ["gluten", "noten", "lactose"],
                maxAmountOfParticipants: 6,
                price: 6.75,
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.be
                    .a("string")
                    .that.equals("Authorization header missing!");

                done();
            });
    });
});

describe("UC 301 maaltijd aanmaken deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-303-3 toegevoegd", function (done) {
        chai.request(server)
            .post("/api/meal/")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "Krabbenburger",
                description:
                    "De legendarische Krabbenburger, gemaakt met aan hand van het begaarde geheime recept van de Krokante Krab",
                isActive: 1,
                isVega: 1,
                isVegan: 1,
                isToTakeHome: 1,
                dateTime: "2022-05-21T11:13:11.932Z",
                imageUrl:
                    "https://i1.sndcdn.com/artworks-uYTqpAuEizvDbNvj-xNF8sw-t500x500.jpg",
                allergenes: ["gluten", "noten", "lactose"],
                maxAmountOfParticipants: 6,
                price: 6.75,
            })
            .end((err, res) => {
                res.should.have.status(201);
                const { statusCode, result } = res.body;

                result[0].id.should.be.a("number");
                result[0].isActive.should.be.a("number").that.equals(1);
                result[0].isVega.should.be.a("number").that.equals(1);
                result[0].isVegan.should.be.a("number").that.equals(1);
                result[0].isToTakeHome.should.be.a("number").that.equals(1);
                result[0].dateTime.should.be.a("string");
                result[0].maxAmountOfParticipants.should.be
                    .a("number")
                    .that.equals(6);
                result[0].price.should.be.a("string").that.equals("6.75");
                result[0].imageUrl.should.be
                    .a("string")
                    .that.equals(
                        "https://i1.sndcdn.com/artworks-uYTqpAuEizvDbNvj-xNF8sw-t500x500.jpg"
                    );
                result[0].cookId.should.be.a("number").that.equals(1);
                result[0].createDate.should.be.a("string");
                result[0].createDate.should.be.a("string");
                result[0].name.should.be
                    .a("string")
                    .that.equals("Krabbenburger");
                result[0].description.should.be
                    .a("string")
                    .that.equals(
                        "De legendarische Krabbenburger, gemaakt met aan hand van het begaarde geheime recept van de Krokante Krab"
                    );
                result[0].allergenes.should.be
                    .a("string")
                    .that.equals("gluten,lactose,noten");

                console.log(new Date());

                done();
            });
    });
});

// It seems to be impossible to insert a meal with an ID added to it.
// describe("UC 304 maaltijd opvragen deel 1", () => {
//     before((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB + INSERT_USER + INSERT_MEALS);
//             connection.release();
//             done();
//         });
//     });

//     it("TC-304-1 sucess opgehaald", function (done) {
//         chai.request(server)
//             .get("/api/meal/")
//             .set({ Authorization: `Bearer ${token}` })

//             .end((err, res) => {
//                 console.log(res.body);
//                 done();
//             });
//     });
// });

// describe("UC 304 maaltijd opvragen deel 2", () => {
//     before((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB + INSERT_USER + INSERT_MEALS);
//             connection.release();
//             done();
//         });
//     });

//     it("TC-304-2 niet gevonden", function (done) {
//         chai.request(server)
//             .get("/api/meal/2")
//             .set({ Authorization: `Bearer ${token}` })

//             .end((err, res) => {
//                 console.log(res.body);
//                 done();
//             });
//     });
// });

// describe("UC 206 deel 1", () => {
//     before((done) => {
//         dbconnection.getConnection(function (err, connection) {
//             connection.query(CLEAR_DB + INSERT_USER, INSERT_MEALS);
//             connection.release();

//             done();
//         });
//     });
//     it("TC-206-1 Gebruiker bestaat niet", function (done) {
//         chai.request(server)
//             .delete("/api/user/1")

//             .set({ Authorization: `Bearer ${token}` })
//             .then((res) => {
//                 console.log(res.body);
//                 res.should.have.status(400);
//                 res.body.message.should.be
//                     .a("string")
//                     .that.equals("user with id: 1 could not be found");

//                 done();
//             })
//             .catch((err) => done(err));
//     });
// });

describe("UC 101 inloggen deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-101-1 Verplicht veld ontbreekt", function (done) {
        chai.request(server)
            .post("/api/auth/login")
            .send({
                // emailAdress: "name@server.nl",
                password: "secret",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("Email must be a string");

                done();
            });
    });
});

describe("UC 101 inloggen deel 2", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-101-2 email niet valide", function (done) {
        chai.request(server)
            .post("/api/auth/login")
            .send({
                emailAdress: "google.com",
                password: "secret",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("please enter a valid emailAdress");

                done();
            });
    });
});

describe("UC 101 inloggen deel 3", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-101-3 wachtwoord niet valide", function (done) {
        chai.request(server)
            .post("/api/auth/login")
            .send({
                emailAdress: "henk@gmail.com",
                password: "",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.be
                    .a("string")
                    .that.equals("password may not be empty");

                done();
            });
    });
});

describe("UC 101 inloggen deel 4", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-101-4 gebruiker bestaat niet", function (done) {
        chai.request(server)
            .post("/api/auth/login")
            .send({
                emailAdress: "henk@gmail.com",
                password: "secret",
            })
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(404);
                res.body.message.should.be
                    .a("string")
                    .that.equals(
                        "User with emailAdres henk@gmail.com has not been found"
                    );

                done();
            });
    });
});

describe("UC 101 inloggen deel 5", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            connection.release();
            done();
        });
    });

    it("TC-101-3 login success", function (done) {
        chai.request(server)
            .post("/api/auth/login")
            .send({
                emailAdress: "name@server.nl",
                password: "secret",
            })
            .end((err, res) => {
                res.should.have.status(200);

                let { statusCode, results } = res.body;

                results.id.should.be.a("number").that.equals(1);
                results.emailAdress.should.be
                    .a("string")
                    .that.equals("name@server.nl");
                results.password.should.be.a("string").that.equals("secret");
                results.firstName.should.be.a("string").that.equals("first");
                results.lastName.should.be.a("string").that.equals("last");
                results.token.should.be.a("string");

                done();
            });
    });
});
