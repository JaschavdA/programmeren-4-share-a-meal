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

/**
 * Db queries to clear and fill the test database before each test.
 */
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

describe("share-a-meal API", () => {
    beforeEach((done) => {
        dbconnection.getConnection(function (err, connection) {
            connection.query(CLEAR_DB + INSERT_USER);
            done();
        });
    });

    describe("UC 201 Registreren als nieuwe gebruiker", () => {
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

    // it("TC-201-1 Verplicht veld ontbreekt", function (done) {
    //     chai.request(server)
    //         .get("/api/user/")
    //         .set({ Authorization: `Bearer ${token}` })
    //         .then((res) => {
    //             console.log(res.body);
    //             done();
    //         })
    //         .catch((err) => done(err));
    // });
});

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
                firstName: "te",
                lastName: "Modaal",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAdress: "test@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
});
