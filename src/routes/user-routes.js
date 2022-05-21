const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controllers");
const authController = require("../controllers/auth-controller");

router.post("/api/user", userController.validateUser, userController.addUser);

router.get(
    "/api/user",
    authController.validateToken,
    userController.getAllUsers
);

router.get("/api/user/profile", userController.getUserProfile);

router.get("/api/user/:userID", userController.getUserById);

router.put(
    "/api/user/:userID",
    userController.validateUser,
    userController.updateUser
);

router.delete("/api/user/:userID", userController.deleteUserById);
module.exports = router;
