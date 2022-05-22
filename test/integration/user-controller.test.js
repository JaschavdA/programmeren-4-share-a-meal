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
const INSERT_MEALS =
    "INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES" +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);";

// it("this is a test", (done) => {
//     assert.equal(true, true);
//     done();
// });

describe("UC 201 Registreren als nieuwe gebruiker", () => {
    beforeEach((done) => {
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

describe("UC 201 Registreren als nieuwe gebruiker deel 2", () => {
    // before((done) => {
    //     dbconnection.getConnection(function (err, connection) {
    //         connection.query(CLEAR_DB);
    //         done();
    //     });
    // });

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
            done();
        });
    });

    it("TC-202-6 Toon gebruikers met zoekterm op bestaande naam (max op 2 velden filteren)", function (done) {
        chai.request(server)
            .get("/api/user?firstName=first2&isActive=1")
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

                done();
            })
            .catch((err) => done(err));
    });
});

describe("UC 203 deel 1", () => {
    before((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
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
    // before((done) => {
    //     dbconnection.getConnection(function (err, connection) {
    //         connection.query(CLEAR_DB + INSERT_USER + INSERT_USER2);
    //         done();
    //     });
    // });
    it("TC-203-2 Valide token en gebruiker bestaat.", function (done) {
        chai.request(server)
            .get("/api/user/profile")
            .set({ Authorization: `Bearer ${token}` })
            .then((res) => {
                // {
                //     statusCode: 200,
                //     result: {
                //       id: 1,
                //       firstName: 'first',
                //       lastName: 'last',
                //       isActive: 1,
                //       emailAdress: 'name@server.nl',
                //       password: 'secret',
                //       phoneNumber: '-',
                //       roles: 'editor,guest',
                //       street: 'street',
                //       city: 'city'
                //     }

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
