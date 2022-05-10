const express = require("express");
const { validateEmailUpdateUser } = require("../controllers/user-controllers");
const router = express.Router();
const controller = require("../controllers/user-controllers");

router.post("/api/user", controller.validateUser, controller.addUser);

router.get("/api/user", controller.getAllUsers);

router.get("/api/user/profile", controller.getUserProfile);

router.get("/api/user/:userID", controller.getUserById);

router.put("/api/user/:userID", controller.validateUser, controller.updateUser);

router.delete("/api/user/:userID", controller.deleteUserById);
module.exports = router;
