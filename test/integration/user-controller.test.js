// const chai = require("chai");
// const chaiHTTP = require("chai-http");
// const server = require("../../index");

// let testDatabase = [];

// chai.should();
// chai.use(chaiHTTP);

// //EXAMPLE, NOT TO BE USED IN FINAL PRODUCT
// describe("Manage users", () => {
//   describe("UC-201 add user", () => {
//     beforeEach(() => {
//       testDatabase = [];
//       done();
//     });

//     it("When a required input is missing, a valid error should be returned", (done) => {
//       chai
//         .request(server)
//         .post("/api/user")
//         .send({
//           //firstName is missing
//           lastName: "de Graver",
//           street: "Lorem Ipsumstraat 1",
//           city: "Gemeente Voorbeeld",
//           password: "123",
//           emailAddress: "henk.degraver@gmail.com",
//         })
//         .end((err, res) => {
//           res.should.be.an("object");
//           let { status, result } = res.body;
//           status.should.equals(400);
//           result.should.be
//             .a("string")
//             .that.equals("firstName must be a string");
//           done();
//         });
//     });
//   });
// });
